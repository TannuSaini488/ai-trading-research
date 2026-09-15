import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { researchQuestion, hypothesis, result } = body;

    if (!researchQuestion || !hypothesis || !result) {
      return NextResponse.json(
        { error: "Research data is required." },
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

    const prompt = `
You are the learning assistant for a trading research prototype.

Research question:
${researchQuestion}

Hypothesis:
${hypothesis}

Verified backtest results:
${JSON.stringify(result)}

Interpret ONLY the verified numbers provided above.

Important:
- Do not invent numbers.
- Do not calculate new metrics.
- Do not introduce buy-and-hold comparisons.
- Do not claim the strategy works generally.
- Mention that the sample size is small.
- Mention that this is prototype/sample historical data.
- Clearly distinguish evidence from interpretation.
- Do not provide financial advice.

Return ONLY valid JSON in exactly this format:

{
  "summary": "string",
  "interpretation": "string",
  "limitations": [
    "string",
    "string",
    "string"
  ],
  "next_questions": [
    "string",
    "string",
    "string"
  ]
}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();

    console.log("LEARN OpenRouter status:", response.status);
    console.log("LEARN OpenRouter response:", data);

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
      return NextResponse.json(
        { error: "AI did not return any content." },
        { status: 500 }
      );
    }

    let cleaned = content.trim();

    cleaned = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON.",
          raw: cleaned,
        },
        { status: 500 }
      );
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const learning = JSON.parse(cleaned);

    return NextResponse.json(learning);
  } catch (error) {
    console.error("LEARN API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate learning summary.",
      },
      { status: 500 }
    );
  }
}