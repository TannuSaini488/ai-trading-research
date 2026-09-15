import fs from "fs";
import path from "path";
import { db } from "../lib/prisma";

async function seedMarketData() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "market",
    "nifty_sample.csv"
  );

  const csv = fs.readFileSync(filePath, "utf-8");
  const lines = csv.trim().split("\n");
  const rows = lines.slice(1);

  const runtime = await db.connect();

  try {
    for (let index = 0; index < rows.length; index++) {
      const [date, open, high, low, close] =
        rows[index].split(",");

      const plan = db.sql.public.marketData.insert([
        {
          id: index + 1,
          date: `${date}T00:00:00Z`,
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
        },
      ]);

      await runtime.execute(plan.build());
    }

    console.log(
      `Seeded ${rows.length} market data rows successfully.`
    );
  } finally {
    await db.close();
  }
}

seedMarketData().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});