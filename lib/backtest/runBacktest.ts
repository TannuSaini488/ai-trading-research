import type { MarketData } from "@/types/market";

export type BacktestTrade = {
    signalDate: string;
    entryDate: string;
    entryPrice: number;
    exitDate: string;
    exitPrice: number;
    returnPercent: number;
};

export type BacktestResult = {
    totalSignals: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageReturn: number;
    totalReturn: number;
    trades: BacktestTrade[];
};

export function runBacktest(
data: MarketData[], experiment: any): BacktestResult {
    const trades: BacktestTrade[] = [];

    const threshold = 0.05;
    const fallWindow = 3;
    const holdingPeriod = 5;

    for (
        let i = fallWindow - 1;
        i < data.length - holdingPeriod;
        i++
    ) {
        const windowStart = data[i - (fallWindow - 1)];
        const signalDay = data[i];

        const decline =
            (signalDay.close - windowStart.close) /
            windowStart.close;

        if (decline <= -threshold) {
            const entryIndex = i + 1;
            const exitIndex = entryIndex + holdingPeriod;

            if (exitIndex >= data.length) {
                continue;
            }

            const entryDay = data[entryIndex];
            const exitDay = data[exitIndex];

            const returnPercent =
                ((exitDay.close - entryDay.open) /
                    entryDay.open) *
                100;

            trades.push({
                signalDate: signalDay.date,
                entryDate: entryDay.date,
                entryPrice: entryDay.open,
                exitDate: exitDay.date,
                exitPrice: exitDay.close,
                returnPercent,
            });
            
            console.log(
                "Checking:",
                windowStart.date,
                "→",
                signalDay.date,
                "Decline:",
                (decline * 100).toFixed(2) + "%"
            );
        }
    }

    const totalTrades = trades.length;

    const winningTrades = trades.filter(
        (trade) => trade.returnPercent > 0
    ).length;

    const losingTrades = trades.filter(
        (trade) => trade.returnPercent <= 0
    ).length;

    const averageReturn =
        totalTrades > 0
            ? trades.reduce(
                (sum, trade) => sum + trade.returnPercent,
                0
            ) / totalTrades
            : 0;

    const totalReturn = trades.reduce(
        (sum, trade) => sum + trade.returnPercent,
        0
    );

    const winRate =
        totalTrades > 0
            ? (winningTrades / totalTrades) * 100
            : 0;

    return {
        totalSignals: totalTrades,
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        averageReturn,
        totalReturn,
        trades,
    };

}