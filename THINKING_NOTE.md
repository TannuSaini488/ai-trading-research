# Thinking Note

## Research Question

**Does buying NIFTY after a sharp fall work?**

## 1. How I Interpreted the Question

The question is asking whether buying NIFTY after a significant decline is followed by positive returns over a defined holding period.

The main ambiguity is that “sharp fall” has no precise definition. The entry timing, holding period, historical test period, and trading costs are also unspecified. These choices can materially change the result.

For the prototype, I made the baseline assumptions explicit rather than silently treating them as user decisions.

## 2. Assumptions

- **Market:** NIFTY 50 Index
- **Sharp fall:** 5% or more decline within 3 trading days
- **Entry:** Next trading day's open
- **Exit:** Close after 5 trading days
- **Holding period:** 5 trading days
- **Test period:** Latest 5 years of available daily historical data
- **Costs:** Transaction costs and slippage where available

These are prototype assumptions, not facts supplied by the user. A real product should let the user confirm or edit them.

## 3. Questions I Considered

Before testing, the system needs to resolve:

- What percentage decline qualifies as a sharp fall?
- Over how many trading days should the decline be measured?
- When exactly should the position be entered?
- How long should it be held?
- What historical period should be tested?
- Should transaction costs and slippage be included?

## 4. Experiment Design

The experiment tests whether a 5% or greater decline within 3 trading days is followed by a positive return when entering at the next trading day's open and exiting after 5 trading days.

The hypothesis is:

> Buying NIFTY at the next trading day's open after a 5% or greater decline within 3 trading days may produce positive returns over the following 5 trading days.

The hypothesis is deliberately phrased as a testable possibility, not a conclusion.

## 5. Product and Technical Decisions

I separated language reasoning from numerical computation.

The AI is used to:
- Understand the research question
- Identify missing parameters
- Suggest explicit assumptions
- Interpret verified results
- Suggest next research questions

The backend is responsible for:
- Loading market data from PostgreSQL
- Applying the experiment definition
- Detecting qualifying signals
- Calculating entry/exit returns
- Producing the numerical result

This prevents the language model from inventing or changing backtest numbers.

I chose a simple Next.js/TypeScript architecture with PostgreSQL rather than introducing a more complex tool layer. The assignment is a prototype, so I prioritized a small, inspectable system over production-level infrastructure.

## 6. Risks and Limitations

The main risks I considered were:

- Ambiguous strategy definitions
- Hidden assumptions
- Incomplete or poor-quality data
- Look-ahead bias
- Transaction costs and slippage
- Overfitting
- Very small sample sizes

The prototype therefore presents results as evidence from the tested dataset rather than as proof that a strategy works.

## 7. What I Would Improve Next

With more time, I would add:
- Larger and higher-quality historical datasets
- Stronger experiment validation
- Benchmark comparisons
- More robust cost modelling
- Experiment history/versioning
- Additional statistical diagnostics
- More extensive backtesting controls

The current prototype deliberately stops short of these features to keep the core research loop clear and demonstrable.
