# ResearchLab

AI-powered trading research prototype built for the SUAS Enterprises AI Full-Stack Developer Internship assignment.

**ASK → CLARIFY → DEFINE → TEST → LEARN**

## Overview

ResearchLab turns a natural-language trading research idea into a small, explicit, testable experiment.

Example:

> Does buying NIFTY after a sharp fall work?

The product does not treat the question as a complete strategy. It identifies missing decisions, proposes visible baseline assumptions, lets the user edit them, defines the experiment, tests it against the available market dataset, and then explains what the observed evidence means.

## Product Flow

### 1. ASK
The user enters a research question in natural language.

### 2. CLARIFY
The AI identifies important missing parameters such as the definition of a sharp fall, entry timing, holding period, test period, and cost assumptions.

Suggested assumptions are shown explicitly and can be edited by the user.

### 3. DEFINE
The clarified assumptions become a structured experiment containing:

- Market
- Condition
- Entry
- Exit
- Holding period
- Test period
- Cost assumptions
- Hypothesis

### 4. TEST
The backend loads market data from PostgreSQL and runs a deterministic TypeScript backtest engine.

The AI is not responsible for calculating returns.

The prototype shows:

- Total trades
- Winning trades
- Losing trades
- Win rate
- Average return per trade
- Sum of trade returns
- Trade-level evidence
- Return-per-trade chart

### 5. LEARN
The verified backtest result is sent to the AI for interpretation.

The Learn screen separates:

- What the data shows
- AI interpretation
- Original hypothesis
- Limitations
- Next research questions

The prototype explicitly warns that sample results are evidence from the tested dataset, not a guarantee of future performance.

## Architecture

```text
User
  ↓
Next.js / React UI
  ↓
ASK / CLARIFY
  ↓
OpenRouter LLM
  ↓
Structured experiment assumptions
  ↓
DEFINE
  ↓
Next.js API
  ↓
Backtest Engine ───── PostgreSQL market data
  ↓
Verified numerical results
  ↓
TEST
  ↓
OpenRouter LLM
  ↓
LEARN
```

### Separation of responsibilities

**AI / LLM**
- Understand natural-language research questions
- Identify missing parameters
- Suggest explicit baseline assumptions
- Explain verified results
- Suggest follow-up research questions

**Backend / deterministic code**
- Validate and execute the experiment
- Load market data
- Detect qualifying signals
- Calculate entry/exit returns
- Produce numerical evidence

**PostgreSQL**
- Stores the market dataset used by the runtime backtest

This separation prevents the LLM from inventing numerical backtest results.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Node.js / Next.js Route Handlers
- PostgreSQL
- Prisma 8 contract/runtime workflow
- OpenRouter
- Git / GitHub

## Data

The prototype uses a small sample NIFTY market dataset for demonstration.

The current sample produced two qualifying trades for the baseline experiment. This is intentionally treated as prototype evidence rather than statistically meaningful proof of a trading strategy.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Configure the PostgreSQL connection used by the project in `.env`:

```env
DATABASE_URL=your_postgresql_connection_string
```

Do not commit either secret file.

### 3. Run the development server

```bash
npm run dev
```

Open the local URL shown by Next.js.

## Example Experiment

For:

> Does buying NIFTY after a sharp fall work?

the prototype baseline is:

- Market: NIFTY 50 Index
- Condition: 5% or more decline within 3 trading days
- Entry: Next trading day's open
- Exit: Close after 5 trading days
- Holding period: 5 trading days
- Test period: Latest 5 years of available daily historical data
- Costs: Transaction costs and slippage where available

These are visible prototype assumptions, not facts supplied by the user.

## Design Decisions

### Why explicit assumptions?
Natural-language trading questions are often underspecified. Making assumptions visible gives the user control and makes the experiment reproducible.

### Why keep calculations outside the LLM?
Numerical backtest results should be deterministic and inspectable. The LLM is used for language understanding and interpretation, while code produces the actual evidence.

### Why use a sample dataset?
The assignment focuses on demonstrating the thinking and product flow rather than building a production-grade data pipeline or backtesting platform.

### Why no MCP?
A direct Next.js API → backtest service → PostgreSQL path was simpler and more appropriate for the assignment scope. MCP was not necessary for this prototype.

## Limitations

- The market dataset is a prototype/sample dataset.
- The sample size is very small.
- The prototype is not a production-grade backtesting engine.
- Transaction costs and slippage are represented at a prototype level.
- Historical results do not guarantee future performance.
- More data and robustness checks would be required before drawing strong conclusions.

## Assignment Scope

This prototype intentionally prioritizes:

1. Clear ambiguity handling
2. Explicit assumptions
3. A reproducible experiment definition
4. Deterministic evidence generation
5. Honest interpretation of small-sample results

It does not attempt to implement a full production trading research platform.
