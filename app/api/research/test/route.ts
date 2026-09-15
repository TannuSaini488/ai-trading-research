import { NextResponse } from "next/server";
import { loadMarketData } from "@/lib/backtest/loadMarketData";
import { runBacktest } from "@/lib/backtest/runBacktest";

export async function POST(req: Request) {
  try {
    const experiment = await req.json();

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment data is required." },
        { status: 400 }
      );
    }

    const marketData = await loadMarketData();

    const result = runBacktest(
      marketData,
      experiment
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Backtest error:", error);

    return NextResponse.json(
      { error: "Failed to run experiment." },
      { status: 500 }
    );
  }
}