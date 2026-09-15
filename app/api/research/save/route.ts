import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const experiment = await req.json();

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment data is required." },
        { status: 400 }
      );
    }

    const runtime = await db.connect();

    try {
      const plan = db.sql.public.researchExperiment.insert([
        {
          id: Date.now(),
          researchQuestion: experiment.researchQuestion,
          hypothesis: experiment.hypothesis,
          market: experiment.market,
          condition: experiment.condition,
          entry: experiment.entry,
          exit: experiment.exit,
          holdingPeriod: experiment.holdingPeriod,
          testPeriod: experiment.testPeriod,
          costAssumptions: experiment.costAssumptions,
          createdAt: new Date().toISOString(),
        },
      ]);

      await runtime.execute(plan.build());
    } finally {
      await db.close();
    }

    return NextResponse.json({
      success: true,
      message: "Experiment saved successfully.",
    });
  } catch (error) {
    console.error("Save experiment error:", error);

    return NextResponse.json(
      { error: "Failed to save experiment." },
      { status: 500 }
    );
  }
}