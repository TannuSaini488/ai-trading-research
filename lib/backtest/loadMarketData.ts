import { db } from "@/lib/prisma";
import type { MarketData } from "@/types/market";

export async function loadMarketData(): Promise<MarketData[]> {
  const runtime = await db.connect();

  try {
    const plan = db.sql.public.marketData
      .select(
        "date",
        "open",
        "high",
        "low",
        "close"
      )
      .orderBy("date", {
        direction: "asc",
      })
      .build();

    const rows = await runtime.query(plan);

    return rows.map((row) => ({
      date: String(row.date),
      open: Number(row.open),
      high: Number(row.high),
      low: Number(row.low),
      close: Number(row.close),
    }));
  } finally {
    await db.close();
  }
}