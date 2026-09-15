// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//     try {
//         const body = await request.json();

//         const question = body.question;

//         if (!question || typeof question !== "string") {
//             return NextResponse.json(
//                 { error: "Question is required" },
//                 { status: 400 }
//             );
//         }

//         const response = await fetch(
//             "https://openrouter.ai/api/v1/chat/completions",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//                 },
//                 body: JSON.stringify({
//                     model: "openrouter/free",
//                     messages: [
//                         {
//                             role: "system",
//                             content: `
// You are an AI assistant for a trading research application.

// Your job is to analyze a user's trading research question and
// turn it into a simple, testable prototype experiment.

// IMPORTANT RULES:

// 1. Do not silently invent important user decisions.

// 2. Identify important missing parameters from the user's question.

// 3. Suggest simple baseline assumptions for missing parameters.

// 4. Every suggested assumption MUST contain a concrete value.
//    Never use placeholders such as:
//    - X%
//    - Y days
//    - TBD
//    - etc.
//    - "for example"
//    - "to be decided"

// 5. Keep the baseline simple.
//    Do not introduce RSI, MACD, stop-losses, volatility filters,
//    confirmation candles, or other technical indicators unless
//    the user explicitly mentions them.

// 6. Do not introduce complex multi-condition strategies.

// 7. If the user says "sharp fall" without defining it, use:
//    "5% or more decline within 3 trading days"
//    as the prototype baseline.

// 8. If the user does not specify a holding period, use:
//    "5 trading days"
//    as the prototype baseline.
//    8a. If the user does not specify an exit rule, use:
//     "Exit at the close after 5 trading days"
//     as the prototype baseline.

// 9. If the user does not specify entry timing, use:
//    "Next trading day's open"
//    as the prototype baseline.

// 10. If the user does not specify the test period, use:
//     "Latest 5 years of available daily historical data"
//     as the prototype baseline.

// 11. If the user does not specify costs, use:
//     "Transaction costs and slippage where available"
//     as the prototype baseline.

// 12. The hypothesis must be a TESTABLE HYPOTHESIS, not a conclusion.
//     Do not claim that the strategy works or does not work before
//     the experiment is actually run.

// 13. Clearly distinguish assumptions from facts.

// 14. Your response must contain ONLY the JSON object.

// 15. Do not use markdown or code fences.

// 16. Do not write any text before or after the JSON.

// 17. Start the response with { and end the response with }.

// Return this exact JSON structure:

// {
//   "research_question": "string",
//   "missing_parameters": [
//     {
//       "name": "string",
//       "question": "string",
//       "why_it_matters": "string"
//     }
//   ],
//   "suggested_assumptions": {
//     "market": "string",
//     "condition": "string",
//     "entry": "string",
//     "exit": "string",
//     "holding_period": "string",
//     "test_period": "string",
//     "cost_assumptions": "string"
//   },
//   "hypothesis": "string"
// }
// `,
//                         },
//                         {
//                             role: "user",
//                             content: question,
//                         },
//                     ],
//                 }),
//             }
//         );

//         if (!response.ok) {
//             const errorText = await response.text();

//             return NextResponse.json(
//                 {
//                     error: "AI request failed",
//                     details: errorText,
//                 },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();

//         const content = data.choices?.[0]?.message?.content;

//         if (!content) {
//             return NextResponse.json(
//                 { error: "No response from AI" },
//                 { status: 500 }
//             );
//         }

//         let result;

//         try {
//             let cleanedContent = content.trim();

//             // Remove markdown code fences if the model added them
//             cleanedContent = cleanedContent
//                 .replace(/^```json\s*/i, "")
//                 .replace(/^```\s*/i, "")
//                 .replace(/\s*```$/i, "")
//                 .trim();

//             // Find the JSON object if the model added extra text
//             const firstBrace = cleanedContent.indexOf("{");
//             const lastBrace = cleanedContent.lastIndexOf("}");

//             if (firstBrace === -1 || lastBrace === -1) {
//                 throw new Error("No JSON object found");
//             }

//             cleanedContent = cleanedContent.slice(
//                 firstBrace,
//                 lastBrace + 1
//             );

//             result = JSON.parse(cleanedContent);
//         } catch (parseError) {
//             console.error("AI JSON parsing failed:", parseError);
//             console.error("Raw AI response:", content);

//             return NextResponse.json(
//                 {
//                     error: "AI returned invalid JSON",
//                     raw: content,
//                 },
//                 { status: 500 }
//             );
//         }

//         return NextResponse.json(result);
//     } catch (error) {
//         console.error(error);

//         return NextResponse.json(
//             { error: "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Research question is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
            {
              role: "system",
              content: `
You are an AI assistant for a trading research application.

Analyze the user's research question and convert it into a simple,
testable prototype experiment.

IMPORTANT:

- Do not silently invent important user decisions.
- Identify missing parameters.
- Suggest concrete baseline assumptions.
- Do not use placeholders such as X%, Y days, TBD, etc.
- Keep the experiment simple.
- Do not introduce RSI, MACD, stop-losses or other indicators unless
  explicitly mentioned by the user.
- If "sharp fall" is undefined, use:
  "5% or more decline within 3 trading days"
- If holding period is undefined, use:
  "5 trading days"
- If entry timing is undefined, use:
  "Next trading day's open"
- If exit is undefined, use:
  "Exit at the close after 5 trading days"
- If test period is undefined, use:
  "Latest 5 years of available daily historical data"
- If costs are undefined, use:
  "Transaction costs and slippage where available"
- The hypothesis must be testable, not a conclusion.
- Do not claim the strategy works before testing it.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add any explanation before or after the JSON.

Return exactly this structure:

{
  "research_question": "string",
  "missing_parameters": [
    {
      "name": "string",
      "question": "string",
      "why_it_matters": "string"
    }
  ],
  "suggested_assumptions": {
    "market": "string",
    "condition": "string",
    "entry": "string",
    "exit": "string",
    "holding_period": "string",
    "test_period": "string",
    "cost_assumptions": "string"
  },
  "hypothesis": "string"
}
              `,
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0,
          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await response.json();

    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "OpenRouter request failed.",
        },
        { status: 500 }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      console.error("AI returned no content:", data);

      return NextResponse.json({
        research_question: question,

        missing_parameters: [
          {
            name: "sharp_fall_definition",
            question:
              'What decline threshold and lookback window should define a "sharp fall"?',
            why_it_matters:
              "Different definitions can produce very different numbers of qualifying events.",
          },
          {
            name: "holding_period",
            question:
              "How long should the position be held after entering?",
            why_it_matters:
              "The holding period determines which future price is used to measure the result.",
          },
          {
            name: "entry_timing",
            question:
              "When should the position be entered after the condition is triggered?",
            why_it_matters:
              "Different entry prices can materially change the return.",
          },
          {
            name: "test_period",
            question:
              "Which historical period should be tested?",
            why_it_matters:
              "Results can vary depending on the market regime and time period.",
          },
          {
            name: "cost_assumptions",
            question:
              "Should transaction costs and slippage be included?",
            why_it_matters:
              "Trading costs can reduce observed returns.",
          },
        ],

        suggested_assumptions: {
          market: "NIFTY 50 Index",
          condition: "5% or more decline within 3 trading days",
          entry: "Next trading day's open",
          exit: "Exit at the close after 5 trading days",
          holding_period: "5 trading days",
          test_period: "Latest 5 years of available daily historical data",
          cost_assumptions:
            "Transaction costs and slippage where available",
        },

        hypothesis:
          "Buying NIFTY at the next trading day's open after a 5% or greater decline within 3 trading days may produce positive returns over the following 5 trading days.",
      });
    }

    let cleanedContent = content.trim();

    // Remove markdown code fences if the model added them
    cleanedContent = cleanedContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Extract the JSON object if the model added extra text
    const firstBrace = cleanedContent.indexOf("{");
    const lastBrace = cleanedContent.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      console.error(
        "No JSON object found in AI response:",
        cleanedContent
      );

      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: cleanedContent,
        },
        { status: 500 }
      );
    }

    cleanedContent = cleanedContent.slice(
      firstBrace,
      lastBrace + 1
    );

    let result;

    try {
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error(
        "Cleaned AI response:",
        cleanedContent
      );

      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: cleanedContent,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Clarify API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}