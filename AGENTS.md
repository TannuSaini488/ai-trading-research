# AI Trading Research Prototype — Build Plan

## 1. Goal

Build a small, working web prototype for the research journey:

**ASK → CLARIFY → DEFINE → TEST → LEARN**

The prototype should let a user enter a natural-language trading research question, make important assumptions visible, convert the question into a structured experiment, test it against historical market data stored in PostgreSQL, and explain the result clearly.

---

## 2. Product Direction

### Visual style

Use a **simple, elegant, light white + green interface**.

The product should feel like a clean research tool, not a trading terminal.

### UI principles

- White background
- Very light gray borders/background sections
- Green as the primary action/accent color
- Dark text for readability
- Minimal shadows
- Rounded but not overly decorative cards
- Generous spacing
- Clear typography
- Smooth transitions
- Responsive layout
- No unnecessary animations
- No crowded dashboards
- No excessive colors
- No fake numbers or fake AI responses

### UX principle

At every stage the user should understand:

1. What the system understood
2. What assumptions were made
3. What the system is testing
4. What data was actually used
5. What the calculated result is
6. What is an interpretation rather than a fact

---

# 3. Recommended Tech Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

Reason: this matches the internship's frontend direction and gives a clean way to build the complete prototype quickly.

## Backend

Use **Next.js Route Handlers / Node.js + TypeScript**.

Suggested API routes:

```text
POST /api/research/clarify
POST /api/research/define
POST /api/research/test
POST /api/research/learn
```

These do not need to be separate if the implementation is cleaner, but keeping responsibilities separated makes the architecture easier to understand.

## AI

Use an LLM API to:

- Understand the user's research question
- Identify missing parameters
- Generate clarification questions
- Convert confirmed assumptions into structured experiment JSON
- Explain calculated results in natural language
- Suggest reasonable next research questions

**Important:** the LLM must NOT invent the final numerical result.

## Validation

Use **Zod** for validating AI-generated structured data.

Example experiment schema:

```ts
{
  market: string,
  condition: string,
  entry: string,
  exit: string,
  holdingPeriod: number,
  testPeriod: {
    start: string,
    end: string
  },
  costAssumptions: {
    transactionCost: number,
    slippage: number
  },
  hypothesis: string
}
```

## Data

Use a historical market-data CSV as the **initial ingestion source**, then store the imported data in **PostgreSQL**.

Suggested CSV fields:

```text
Date
Open
High
Low
Close
Volume
```

The CSV is not the runtime source for the backtest after ingestion. The intended flow is:

```text
Historical CSV
      ↓
Data ingestion/import
      ↓
PostgreSQL market_data table
      ↓
Backtest/Test Engine
```

A historical CSV is preferable for this prototype because:

- Results are reproducible
- No dependency on a live market API
- The demo remains stable
- Backtest calculations can be deterministic
- The data source can be clearly shown to the user

---

# 4. Exact Implementation Architecture

This is the core architecture to implement.

```text
┌──────────────────────────────┐
│          USER / UI           │
│       Next.js + React        │
└──────────────┬───────────────┘
               │
               │ research question
               ↓
┌──────────────────────────────┐
│       AI / LLM Layer         │
│  clarify + structure only    │
└──────────────┬───────────────┘
               │
               │ structured experiment JSON
               ↓
┌──────────────────────────────┐
│        Backend API           │
│ Next.js Route Handlers / TS  │
└──────────────┬───────────────┘
               │
               ↓
┌──────────────────────────────┐
│     Deterministic Test       │
│       / Backtest Engine      │
└──────────────┬───────────────┘
               │
               │ query market_data
               ↓
┌──────────────────────────────┐
│         PostgreSQL           │
│        market_data           │
│  + experiments/results       │
└──────────────┬───────────────┘
               │
               │ historical rows
               ↓
┌──────────────────────────────┐
│     Backtest Calculations    │
│ events → entries → exits →   │
│ returns → costs → statistics │
└──────────────┬───────────────┘
               │
               │ verified result JSON
               ↓
┌──────────────────────────────┐
│          LEARN AI            │
│ interpretation only          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│        LEARN SCREEN          │
│ data + interpretation + next │
│ research questions           │
└──────────────────────────────┘
```

## Critical separation

**The AI does not directly read PostgreSQL and does not calculate the backtest.**

The correct responsibility split is:

```text
AI
→ understands question
→ asks/identifies clarification
→ creates experiment structure
→ explains verified results

Backend / Code
→ validates experiment
→ queries PostgreSQL
→ runs deterministic calculations
→ produces numerical results

PostgreSQL
→ stores historical market data
→ stores experiments/results for persistence
```

The LLM receives **verified result data from the backend**, not raw database access.

---

# 5. Data Ingestion Flow

The historical dataset should be imported into PostgreSQL before testing.

## One-time / setup flow

```text
nifty.csv
   ↓
Validate CSV columns/types
   ↓
Parse rows
   ↓
Normalize dates/numbers
   ↓
Insert into PostgreSQL
   ↓
market_data table
```

Example table:

```text
market_data
-----------
id
symbol
date
open
high
low
close
volume
```

For the initial prototype, `symbol = NIFTY` is sufficient.

## Important rule

Do not repeatedly parse the CSV inside every test request if PostgreSQL is being used as the application's market-data store.

The CSV is the **ingestion source**.

PostgreSQL is the **runtime data source**.

---

# 6. Most Important Architecture Decision

Do **not** let the AI calculate or invent backtest results.

Use this exact flow:

```text
User Question
      ↓
LLM
      ↓
Clarification / Assumptions
      ↓
Structured Experiment JSON
      ↓
Backend API
      ↓
Deterministic Test Engine
      ↓
Query PostgreSQL market_data
      ↓
Filter test period
      ↓
Find condition events
      ↓
Apply entry rule
      ↓
Apply exit rule
      ↓
Calculate returns
      ↓
Apply costs/slippage
      ↓
Aggregate statistics
      ↓
Verified Result JSON
      ↓
LLM
      ↓
Human-readable Learn Screen
```

### AI is responsible for

- Language understanding
- Clarification
- Structuring
- Explanation
- Next-question suggestions

### Code is responsible for

- Reading/querying market data
- Finding qualifying events
- Calculating entry/exit prices
- Calculating returns
- Applying costs
- Counting observations
- Calculating statistics
- Producing chart data

### PostgreSQL is responsible for

- Storing historical market rows
- Providing deterministic market data to the test engine
- Persisting experiments/results when enabled

This makes the prototype much more trustworthy and prevents a hardcoded/fake AI demo.

---

# 7. Website Structure

Keep the website to **one main research workspace** rather than many unnecessary pages.

Recommended top-level layout:

```text
------------------------------------------------
Logo / Product Name             New Research
------------------------------------------------

ASK
  ↓
CLARIFY
  ↓
DEFINE
  ↓
TEST
  ↓
LEARN
------------------------------------------------
```

A small progress indicator can show the current stage.

Example:

**ASK → CLARIFY → DEFINE → TEST → LEARN**

Completed steps can have a subtle green indicator.

---

# 8. Screen 1 — ASK

## Purpose

Allow the user to enter **any relevant trading research question**.

Do NOT hardcode only:

> Does buying NIFTY after a sharp fall work?

That question should only be an example/placeholder.

### UI

Large centered research input:

```text
What do you want to investigate?

[ Does buying NIFTY after a sharp fall work?              ]

                         Analyze Question
```

Below it:

```text
Example:
Does buying NIFTY after a sharp fall work?
```

The example is only a placeholder/example. The actual input must be user-controlled.

### Behavior

When the user submits:

```text
POST /api/research/clarify
```

Send the question to the backend.

The backend sends the question to the LLM with instructions to identify missing information.

Do not immediately run the test.

---

# 9. Screen 2 — CLARIFY

## Purpose

Identify ambiguity before creating the experiment.

The project specifically requires the system to identify important missing information and either ask questions or present assumptions for confirmation. Important parameters must not be silently invented.

### Example

User asks:

> Does buying NIFTY after a sharp fall work?

System may show:

```text
I need a few details before testing this.

What should count as a "sharp fall"?

○ 5% or more within 3 trading days
○ 5% or more within 5 trading days
○ Define my own
```

Then:

```text
How long should the position be held?

○ 5 trading days
○ 10 trading days
○ 20 trading days
○ Define my own
```

The important point is that assumptions are **visible and editable**.

### Good UX

Use compact cards rather than a long chat interface.

Example:

```text
┌─────────────────────────────────────────┐
│ Sharp fall                               │
│                                          │
│ 5% or more within 3 trading days         │
│                              Change ›    │
└─────────────────────────────────────────┘
```

At the bottom:

```text
[ Back ]                         [ Continue ]
```

---

# 10. Screen 3 — DEFINE

## Purpose

Show the final structured experiment before testing.

The project specifies these core fields:

- MARKET
- CONDITION
- ENTRY
- EXIT
- HOLDING PERIOD
- TEST PERIOD
- COST ASSUMPTIONS
- HYPOTHESIS

The exact structure is intentionally left to the candidate.

### UI

Use a clean experiment summary card:

```text
Research Experiment

MARKET
NIFTY

CONDITION
5% or more fall within 3 trading days

ENTRY
Buy after the condition is satisfied

EXIT
After the selected holding period

HOLDING PERIOD
5 trading days

TEST PERIOD
[ Start date ] → [ End date ]

COST ASSUMPTIONS
Transaction cost: ...
Slippage: ...

HYPOTHESIS
Buying NIFTY after a sharp fall may produce positive
returns over the selected holding period.
```

Every field should be editable.

### Important

The LLM should return structured JSON.

Example:

```json
{
  "market": "NIFTY",
  "condition": {
    "type": "percentage_drop",
    "threshold": 5,
    "windowTradingDays": 3
  },
  "entry": {
    "type": "next_trading_day_open"
  },
  "exit": {
    "type": "after_holding_period"
  },
  "holdingPeriodTradingDays": 5,
  "testPeriod": {
    "start": "...",
    "end": "..."
  },
  "costAssumptions": {
    "transactionCostPct": 0,
    "slippagePct": 0
  },
  "hypothesis": "..."
}
```

The exact schema can be adjusted during implementation.

---

# 11. Screen 4 — TEST

## Purpose

Actually execute the experiment against data.

The project says the prototype only needs to demonstrate how the experiment could be tested; a production-grade backtesting engine is not required.

## Exact runtime test flow

```text
Experiment JSON
      ↓
Validate with Zod
      ↓
Determine supported market/condition
      ↓
Query PostgreSQL market_data
      ↓
Filter rows to selected test period
      ↓
Find condition events
      ↓
Apply entry rule
      ↓
Apply exit rule
      ↓
Calculate return for each event
      ↓
Apply transaction costs/slippage
      ↓
Aggregate statistics
      ↓
Return BacktestResult JSON
```

### Example query responsibility

The backend/test engine should conceptually do:

```text
SELECT *
FROM market_data
WHERE symbol = 'NIFTY'
  AND date BETWEEN testStart AND testEnd
ORDER BY date ASC;
```

Then the deterministic engine operates on those rows.

### Example result object

```ts
{
  totalEvents: number,
  positiveEvents: number,
  negativeEvents: number,
  winRate: number,
  averageReturn: number,
  medianReturn: number,
  bestReturn: number,
  worstReturn: number,
  trades: [
    {
      entryDate: string,
      entryPrice: number,
      exitDate: string,
      exitPrice: number,
      returnPct: number
    }
  ]
}
```

All values must come from the actual test engine.

---

# 12. Deterministic Backtest Logic

For the initial NIFTY experiment, keep the engine intentionally simple.

Example condition:

```text
A sharp fall means:
current close is at least 5% below the close
3 trading days earlier.
```

Example entry:

```text
Enter at the next trading day's Open.
```

Example exit:

```text
Exit at the Close after 5 trading days.
```

Example return:

```text
grossReturnPct =
((exitPrice - entryPrice) / entryPrice) * 100
```

Then apply the configured cost/slippage assumptions.

The exact rule must match the structured experiment shown to the user.

### Avoid look-ahead bias

The test engine must not use future information to decide an entry.

For example:

```text
Condition observed using data available up to Day D
                    ↓
Entry on Day D+1
                    ↓
Exit after the configured holding period
```

This is an important research-quality detail to mention in the README/Thinking Note.

---

# 13. Screen 5 — LEARN

## Purpose

Explain the result to a normal user.

The project suggests showing:

- Result
- What the data shows
- What we can reasonably conclude
- What should we investigate next?

### Recommended layout

```text
Research Result

+1.8%
Average Return

18
Events

61%
Positive Outcomes
```

Then:

### What the data shows

This section should display factual statistics generated by the test engine.

Example:

```text
The experiment found 18 qualifying events.
11 had positive returns and 7 had negative returns.
The average return over the selected holding period was +1.8%.
```

These numbers must be generated from the data.

### What we can reasonably conclude

This section can use the LLM to explain the result:

```text
In this historical sample, buying after the defined sharp-fall
condition was associated with positive average returns.
However, the sample is limited and this result does not establish
that the strategy will work in the future.
```

### What should we investigate next?

The AI can suggest questions based on the actual experiment:

```text
Possible next questions

• Does the result change with a 10-day holding period?
• Does the result remain after higher transaction costs?
• Does the result differ in different market regimes?
```

These suggestions should be generated from the experiment, not hardcoded.

---

# 14. Data vs AI Separation

This is one of the most important parts of the implementation.

## Data-derived facts

Must come from code:

- Number of events
- Number of positive outcomes
- Number of negative outcomes
- Average return
- Median return
- Best/worst return
- Trade dates
- Entry/exit prices
- Any chart values

## AI-generated content

Can come from the LLM:

- Interpretation
- Plain-language explanation
- Caveats
- Next research questions

### Never do this

```ts
const result = {
  averageReturn: 1.8,
  winRate: 61
};
```

just to make the demo look complete.

### Instead

```ts
const marketData = await getMarketDataFromPostgres(experiment);

const result = runExperiment(
  experiment,
  marketData
);
```

Then display the returned values.

---

# 15. No Hardcoding Rule

The prototype should contain **zero hardcoded research answers**.

Hardcoding is acceptable only for product configuration or safe defaults.

### Allowed

- UI labels
- Example placeholder question
- Default empty state
- Default supported-market configuration
- Schema definitions
- Validation rules
- Static explanatory text
- Supported condition definitions

### Not allowed

- Hardcoded AI answers
- Hardcoded backtest statistics
- Hardcoded trade results
- Hardcoded "successful strategy" conclusions
- Hardcoded charts pretending to be calculated
- A fake loading state followed by a predetermined result

The user question → AI → experiment → PostgreSQL data → calculations → result must be real.

---

# 16. AI Prompt Design

Use structured output rather than asking the model for a paragraph and parsing it manually.

## Clarification prompt

The model should receive:

```text
You are a trading research assistant.

Analyze the user's research question.

Identify:
1. Market/instrument
2. Missing condition definition
3. Missing entry rule
4. Missing exit rule
5. Missing holding period
6. Missing test period
7. Missing cost assumptions

Do not silently invent important parameters.

Return structured JSON containing:
- understoodQuestion
- missingParameters
- suggestedOptions
- assumptions
```

## Define prompt

After the user confirms/edits assumptions:

```text
Convert the confirmed research idea into a structured
experiment.

Return only valid structured experiment data.

Do not calculate results.
Do not invent historical data.
Do not claim the hypothesis is true.
```

## Learn prompt

Send the **actual calculated result** to the LLM:

```text
Explain the following experiment result to a normal user.

Important:
- Do not change numerical values.
- Do not invent observations.
- Clearly distinguish data-derived facts from interpretation.
- Mention important limitations.
- Suggest useful next research questions.
```

---

# 17. Supported Scope

The input should be flexible, but the prototype should not pretend to support every possible trading question.

Recommended prototype scope:

### Supported

- Historical price-based research
- NIFTY initially
- Percentage/price movement conditions
- Entry after a condition
- Fixed holding periods
- Historical test periods
- Basic transaction cost/slippage assumptions

### Out of scope for this prototype

- Live trading
- Broker integration
- Portfolio management
- Options strategy execution
- Real-time signals
- User authentication
- Payments
- Production-grade quantitative engine
- Huge multi-market data platform

If a user asks something outside the supported scope, the system should clearly say that the prototype cannot reliably test it yet instead of pretending.

---

# 18. API / Service Responsibilities

Keep each backend responsibility clear.

```text
/api/research/clarify
        ↓
LLM clarification service

/api/research/define
        ↓
LLM structured experiment service

/api/research/test
        ↓
Validate experiment
        ↓
Query PostgreSQL
        ↓
Run deterministic engine
        ↓
Return BacktestResult

/api/research/learn
        ↓
Receive BacktestResult
        ↓
LLM interpretation
        ↓
Return Learning response
```

A single API route can combine stages if that makes the prototype simpler, but the internal service responsibilities should remain separated.

---

# 19. Error Handling

The UI should handle:

### Invalid question

```text
I couldn't identify a testable trading experiment from this question.

Try specifying an asset, condition, or trading idea.
```

### Missing data

```text
The selected experiment cannot be tested with the available dataset.
```

### Unsupported strategy

```text
This prototype currently supports historical price-based experiments.
This strategy requires data that is not currently available.
```

### AI failure

```text
We couldn't structure this question right now.
Please try again.
```

Never display a fake successful result when the test failed.

---

# 20. Charts

Keep charts minimal.

Recommended:

### 1. Return distribution

A simple bar/histogram showing calculated trade returns.

### 2. Cumulative return

A simple line chart based on actual calculated trade results.

### 3. Event table

```text
Date       Entry      Exit       Return
----------------------------------------
...
```

Charts must use real test-engine output.

Avoid building a large trading dashboard. The project explicitly says the goal is not the largest number of features or the most beautiful UI.

---

# 21. Suggested Project Structure

Update the project structure so data ingestion and database access are explicit:

```text
src/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   └── research/
│   │       ├── clarify/
│   │       │   └── route.ts
│   │       ├── define/
│   │       │   └── route.ts
│   │       ├── test/
│   │       │   └── route.ts
│   │       └── learn/
│   │           └── route.ts
│
├── components/
│   ├── ResearchInput.tsx
│   ├── ClarifyStep.tsx
│   ├── ExperimentEditor.tsx
│   ├── TestProgress.tsx
│   ├── ResultSummary.tsx
│   ├── ResultChart.tsx
│   └── ResearchStepper.tsx
│
├── lib/
│   ├── ai/
│   │   ├── clarify.ts
│   │   ├── define.ts
│   │   └── learn.ts
│   │
│   ├── backtest/
│   │   ├── engine.ts
│   │   ├── conditions.ts
│   │   └── metrics.ts
│   │
│   ├── db/
│   │   ├── prisma.ts
│   │   └── marketData.ts
│   │
│   ├── data/
│   │   └── importMarketData.ts
│   │
│   └── validation/
│       └── experiment.ts
│
├── prisma/
│   └── schema.prisma
│
├── types/
│   └── research.ts
│
└── data/
    └── market/
        └── nifty.csv
```

This structure keeps AI, database access, data ingestion, backtesting, and UI responsibilities separate.

---

# 22. State Management

For a small prototype, avoid unnecessary state-management libraries.

Use React state or a small context.

Main research state:

```ts
type ResearchSession = {
  question: string;
  clarifications: Clarification[];
  experiment: Experiment | null;
  result: BacktestResult | null;
  learning: Learning | null;
  currentStep: ResearchStep;
};
```

If the page becomes too large, split components rather than adding complexity.

---

# 23. Database

PostgreSQL is useful because the internship specifically involves PostgreSQL and experiment management.

Use Prisma for the database layer.

Recommended simple PostgreSQL structure:

```text
market_data
-----------
id
symbol
date
open
high
low
close
volume

research_sessions
-----------------
id
question
created_at

experiments
-----------
id
session_id
experiment_json
created_at

experiment_results
------------------
id
experiment_id
result_json
created_at
```

## Database relationships

```text
research_sessions
       │
       └──< experiments
                 │
                 └──< experiment_results

market_data
    ↑
    │
backtest engine queries this
```

## Important runtime rule

The backtest engine reads historical market data from:

```text
PostgreSQL → market_data
```

It should not depend on the raw CSV during a normal test request.

The CSV is used to initially populate the database.

---

# 24. Loading and Progress UX

Testing may take a few seconds.

Show meaningful progress:

```text
Preparing experiment...
✓ Loading market data
✓ Finding qualifying events
• Calculating returns
• Preparing results
```

Do not use a fake progress percentage.

Only show completed steps when they actually complete.

---

# 25. Empty and Initial State

The initial screen should be very clean.

Example:

```text
Research smarter.

Turn a trading idea into a
testable experiment.

[ What do you want to investigate?              ]

                 Analyze Question

Historical research • Transparent assumptions • Data-driven results
```

Keep the page visually light.

---

# 26. Responsive Design

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Header                                      │
├─────────────────────────────────────────────┤
│                                             │
│              Research Workspace             │
│                                             │
│              Current Step                   │
│                                             │
│              Main Content                   │
│                                             │
└─────────────────────────────────────────────┘
```

Mobile:

- Single column
- Full-width input
- Cards stacked vertically
- Buttons full-width where appropriate
- Charts scroll horizontally if needed

---

# 27. Exact End-to-End Implementation Flow

This is the flow that should be implemented in code.

## Step 1 — User asks a question

Example:

```text
Does buying NIFTY after a sharp fall work?
```

Frontend stores:

```ts
question
```

and calls:

```text
POST /api/research/clarify
```

---

## Step 2 — AI analyzes the question

Backend sends the question to the LLM.

LLM returns structured clarification data:

```text
understoodQuestion
missingParameters
suggestedOptions
assumptions
```

No backtest is run yet.

---

## Step 3 — User confirms assumptions

The UI displays the assumptions as editable controls.

Example:

```text
Market: NIFTY
Sharp fall: 5% within 3 trading days
Entry: next trading day open
Holding period: 5 trading days
Test period: selected historical range
Costs: user-confirmed values
```

User can modify them.

---

## Step 4 — AI creates experiment JSON

Frontend sends the confirmed assumptions to:

```text
POST /api/research/define
```

The LLM converts them into validated structured experiment JSON.

Zod validates the response.

If validation fails, do not continue to testing.

---

## Step 5 — Show DEFINE screen

Display the exact experiment that will be tested.

The user should be able to review/edit it before pressing:

```text
Run Experiment
```

---

## Step 6 — TEST API receives experiment

Frontend sends:

```text
POST /api/research/test
```

with the experiment JSON.

Backend:

```text
Validate experiment
      ↓
Check supported market/condition
      ↓
Query PostgreSQL market_data
      ↓
Filter selected test period
      ↓
Run deterministic backtest
      ↓
Calculate all metrics
      ↓
Return result JSON
```

---

## Step 7 — Backtest engine calculates actual results

The engine determines:

```text
qualifying events
entry dates
entry prices
exit dates
exit prices
individual returns
cost-adjusted returns
aggregate statistics
```

Example result shape:

```ts
{
  totalEvents,
  positiveEvents,
  negativeEvents,
  winRate,
  averageReturn,
  medianReturn,
  bestReturn,
  worstReturn,
  trades
}
```

No numbers are generated by the LLM.

---

## Step 8 — Store experiment/result

If persistence is enabled:

```text
research_sessions
      ↓
experiments
      ↓
experiment_results
```

Store the structured experiment and calculated result JSON.

---

## Step 9 — Generate LEARN explanation

Send the actual result JSON plus experiment context to the LLM.

The LLM returns:

```text
summary
interpretation
limitations
nextQuestions
```

The prompt must explicitly tell the LLM not to change numerical values or invent observations.

---

## Step 10 — Display LEARN

Show two visually distinct areas:

### What the data shows

100% data-derived.

### What we can reasonably conclude

AI interpretation based only on the experiment and calculated result.

Then:

### What should we investigate next?

AI-generated next questions.

This separation is a key product decision.

---

# 28. MCP Decision

MCP is **not required for this prototype**.

Do not add MCP merely for the sake of saying the project uses MCP.

the simpler architecture is:

```text
Next.js API
   ↓
Service functions
   ↓
Prisma
   ↓
PostgreSQL
```

If an MCP-style tool layer is ever added later, useful tools could be:

```text
get_market_data()
run_backtest()
save_experiment()
get_experiment_history()
```

But this is optional future architecture, not a core requirement.

The current prototype should prioritize a working, understandable implementation over unnecessary infrastructure.

---

# 29. Implementation Order

Build in this order so the core workflow works as early as possible.

### Phase 1 — Project setup

1. Create Next.js + TypeScript project
2. Configure Tailwind
3. Create the main research workspace
4. Build ASK → CLARIFY → DEFINE → TEST → LEARN stepper

### Phase 2 — AI flow

5. Build ASK input
6. Connect actual question to `/api/research/clarify`
7. Add clarification prompt
8. Display dynamic assumptions
9. Make assumptions editable
10. Connect `/api/research/define`
11. Validate experiment JSON with Zod

### Phase 3 — Database/data

12. Set up PostgreSQL
13. Configure Prisma
14. Create `market_data`
15. Import `nifty.csv` into `market_data`
16. Verify rows/date ordering/data types
17. Add experiment/result tables

### Phase 4 — Backtest

18. Build deterministic condition evaluator
19. Build entry/exit logic
20. Build return calculation
21. Add cost/slippage calculation
22. Build aggregate metrics
23. Build `/api/research/test`
24. Make TEST query PostgreSQL, not the CSV

### Phase 5 — LEARN

25. Display actual calculated metrics
26. Add charts from result JSON
27. Connect `/api/research/learn`
28. Add AI interpretation
29. Add AI-generated next questions
30. Clearly separate facts from interpretation

### Phase 6 — Polish

31. Loading states
32. Error states
33. Responsive design
34. Clean white/green visual system
35. Save experiment/result history if time allows
36. Deploy

---

# 30. Charts

Charts should consume only the result returned by the backtest engine.

```text
PostgreSQL
    ↓
Backtest Engine
    ↓
BacktestResult
    ↓
Chart components
```

Never do:

```text
LLM
 ↓
invented chart numbers
 ↓
chart
```

---

# 31. End-to-End Example

### User enters

```text
Does buying NIFTY after a sharp fall work?
```

### ASK

Question is sent to the backend.

### CLARIFY

AI identifies:

```text
"Sharp fall" is undefined.
Holding period is undefined.
Test period is undefined.
Cost assumptions are undefined.
```

User confirms/edits the assumptions.

### DEFINE

System creates structured experiment:

```text
Market: NIFTY
Condition: 5% fall within 3 trading days
Entry: Next trading day
Exit: After 5 trading days
Test Period: selected historical range
Costs: user-confirmed assumptions
Hypothesis: positive returns may follow sharp falls
```

### TEST

The backend:

```text
1. Validates the experiment
2. Queries PostgreSQL market_data
3. Filters the selected historical period
4. Finds dates satisfying the condition
5. Applies the entry rule
6. Applies the exit rule
7. Calculates each return
8. Applies costs
9. Calculates aggregate metrics
```

### LEARN

The UI displays the actual calculated statistics.

The AI then explains those statistics without changing them.

---

# 32. What Must Be Demonstrated in the 2–3 Minute Demo

The project asks for the complete user journey.

Demo this exact flow:

```text
1. Enter research question
        ↓
2. Show clarification
        ↓
3. Confirm/edit assumptions
        ↓
4. Show structured experiment
        ↓
5. Run test
        ↓
6. Show real calculated results
        ↓
7. Show AI explanation
        ↓
8. Show next research questions
```

Do not spend most of the demo showing code.

Show the product thinking.

---

# 33. Build Priority

If time becomes limited, implement in this order:

### Priority 1 — Must work

- ASK
- CLARIFY
- DEFINE
- PostgreSQL
- Historical CSV ingestion
- Deterministic test engine
- TEST querying PostgreSQL
- LEARN
- Real calculations
- No hardcoded results

### Priority 2 — Important polish

- Elegant white/green UI
- Editable assumptions
- Result charts
- Loading states
- Error states
- Responsive design

### Priority 3 — Nice to have

- Experiment history
- More supported conditions
- Additional markets
- Better result visualizations
- More advanced research management

### Do NOT sacrifice the core workflow for extra features.

The project explicitly prioritizes critical thinking, independent thinking, problem solving, product thinking, and a working prototype over feature quantity or sophisticated AI.

---

# 34. Definition of Done

The prototype is ready when:

- [ ] User can enter a custom research question
- [ ] Question is actually sent to the AI
- [ ] AI identifies ambiguity/missing parameters
- [ ] Assumptions are visible
- [ ] User can edit important assumptions
- [ ] Experiment is generated as structured data
- [ ] Experiment is validated before testing
- [ ] Historical CSV has been imported into PostgreSQL
- [ ] `market_data` contains the required historical rows
- [ ] Backtest queries PostgreSQL for market data
- [ ] Backtest calculations are performed by code
- [ ] Result numbers are not hardcoded
- [ ] Charts use calculated results
- [ ] AI explains actual results
- [ ] Data and interpretation are clearly separated
- [ ] Unsupported questions fail honestly
- [ ] Failed tests never show fake success
- [ ] UI is clean, white, green, responsive, and easy to use
- [ ] Complete ASK → CLARIFY → DEFINE → TEST → LEARN journey works
- [ ] The prototype can be explained clearly in the demo

---

# 35. Final Product Principle

The prototype should communicate one clear idea:

> **AI helps turn a vague trading idea into a structured experiment; the data and code determine what actually happened.**

That is stronger than building a chatbot that simply gives a trading answer.

**Build less. Think more.**
