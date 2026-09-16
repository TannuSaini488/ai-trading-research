# AI Usage Note

## AI Tools Used

I used AI as a supporting development assistant, while keeping the main product thinking, implementation decisions, and coding under my own control.

### Where I Used AI

AI was mainly used for limited assistance with:

- Brainstorming and refining the product workflow
- Debugging a few implementation issues when I was stuck
- Reviewing prompts and improving JSON response reliability
- Reviewing documentation and explaining technical errors

### What I Did Myself

The majority of the work was done independently, including:

- Defining the ResearchLab product idea and user flow
- Deciding the ASK → CLARIFY → DEFINE → TEST → LEARN experience
- Deciding which assumptions should be visible and editable
- Designing the experiment structure
- Implementing the Next.js / React UI
- Implementing the API routes
- Implementing the deterministic backtest logic
- Connecting the backtest to PostgreSQL market data
- Building the trade evidence and result visualization
- Designing the separation between AI-generated interpretation and data-derived results
- Testing the application and fixing implementation issues
- Making the final product and scope decisions

AI was not used to generate the final backtest results. Numerical results are produced by the application's code using the market data stored in PostgreSQL.

## AI in the Product

The application itself uses an LLM for a limited set of tasks:

- Understanding a natural-language research question
- Identifying missing parameters
- Suggesting explicit assumptions
- Interpreting verified backtest results
- Suggesting follow-up research questions

The LLM does **not** directly access PostgreSQL, calculate returns, or generate the numerical backtest result.

The runtime flow is:

```text
User Question
      ↓
LLM assistance
      ↓
Experiment assumptions
      ↓
Deterministic TypeScript backtest
      ↓
Verified numerical results
      ↓
LLM interpretation
```

## Important Development Principle

I treated AI as a tool for assistance rather than as the primary builder of the project.

When AI suggestions did not match the product requirements, I modified or rejected them. For example, an early generated hypothesis introduced a buy-and-hold benchmark and “excess return,” even though the prototype did not define or calculate that comparison. I removed that idea rather than implementing an unsupported metric.

I also constrained the product AI so that important assumptions are visible to the user and numerical results always come from code and data.

## Summary

AI helped me with limited brainstorming, debugging, prompt refinement, and review. The core product thinking, architecture decisions, implementation, backtest logic, data flow, and final decisions were primarily my own work.
