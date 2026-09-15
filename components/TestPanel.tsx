"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { BacktestResult } from "@/lib/backtest/runBacktest";

type Props = {
  result: BacktestResult;
  onBack: () => void;
  onLearn: () => void;
};

export default function TestPanel({ result, onBack, onLearn }: Props) {
  return (
    <div className="mx-auto mt-10 w-full max-w-5xl text-left">
      <div className="mb-8">
        <p className="text-sm font-medium text-green-600">TEST</p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Experiment results
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          The experiment was tested against the available historical sample
          data.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total trades"
          value={result.totalTrades.toString()}
        />

        <MetricCard
          label="Winning trades"
          value={result.winningTrades.toString()}
        />

        <MetricCard
          label="Losing trades"
          value={result.losingTrades.toString()}
        />

        <MetricCard label="Win rate" value={`${result.winRate.toFixed(1)}%`} />
      </div>

      {/* Returns */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Average return / trade"
          value={`${result.averageReturn.toFixed(2)}%`}
        />

        <MetricCard
          label="Sum of trade returns"
          value={`${result.totalReturn.toFixed(2)}%`}
        />
      </div>

      {/* Trade table */}
      {/* <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900">Trade evidence</h3>

          <p className="mt-1 text-sm text-gray-500">
            Each row represents one detected signal and its resulting trade.
          </p>
        </div>

        {result.trades.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No qualifying trades were found in the sample data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-600">
                    Signal
                  </th>

                  <th className="px-6 py-4 font-medium text-gray-600">Entry</th>

                  <th className="px-6 py-4 font-medium text-gray-600">
                    Entry price
                  </th>

                  <th className="px-6 py-4 font-medium text-gray-600">Exit</th>

                  <th className="px-6 py-4 font-medium text-gray-600">
                    Exit price
                  </th>

                  <th className="px-6 py-4 font-medium text-gray-600">
                    Return
                  </th>
                </tr>
              </thead>

              <tbody>
                {result.trades.map((trade) => (
                  <tr
                    key={`${trade.signalDate}-${trade.entryDate}`}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {trade.signalDate}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {trade.entryDate}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {trade.entryPrice.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {trade.exitDate}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {trade.exitPrice.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {trade.returnPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900">Return per trade</h3>
          <p className="mt-1 text-sm text-gray-500">
            Observed return for each qualifying trade.
          </p>
        </div>

        {result.trades.length === 0 ? (
          <p className="text-sm text-gray-500">
            No trade data available to visualize.
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.trades.map((trade, index) => ({
                  trade: `Trade ${index + 1}`,
                  return: Number(trade.returnPercent.toFixed(2)),
                }))}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trade" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Return"]} />
                <Bar dataKey="return" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Evidence note */}
      <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
          Important
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          These results come from the prototype&apos;s sample historical
          dataset. They are evidence from the tested data, not a guarantee of
          future performance.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Define
        </button>

        <button
          onClick={onLearn}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Continue to Learn →
        </button>
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
