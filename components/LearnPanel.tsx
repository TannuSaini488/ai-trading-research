"use client";

import { useEffect, useState } from "react";
import type { BacktestResult } from "@/lib/backtest/runBacktest";

type LearnResult = {
  summary: string;
  interpretation: string;
  limitations: string[];
  next_questions: string[];
};

type Props = {
  result: BacktestResult;
  researchQuestion: string;
  hypothesis: string;
  onBack: () => void;
};

export default function LearnPanel({
  result,
  researchQuestion,
  hypothesis,
  onBack,
}: Props) {
  const [learning, setLearning] =
    useState<LearnResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generateLearning() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/research/learn",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              researchQuestion,
              hypothesis,
              result,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to generate learning summary."
          );
        }

        setLearning(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate learning summary."
        );
      } finally {
        setLoading(false);
      }
    }

    generateLearning();
  }, [researchQuestion, hypothesis, result]);

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl text-left">
      <div className="mb-8">
        <p className="text-sm font-medium text-green-600">
          LEARN
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          What did we learn?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          The results below separate observed evidence from
          interpretation and future questions.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Research question
        </p>

        <p className="mt-2 text-lg font-medium leading-7 text-gray-900">
          {researchQuestion}
        </p>
      </div>

      {/* VERIFIED DATA */}

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-sm font-medium text-green-600">
            01
          </p>

          <h3 className="mt-1 text-xl font-semibold text-gray-900">
            What the data shows
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            These numbers come directly from the backtest
            engine.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Metric
            label="Qualifying trades"
            value={result.totalTrades.toString()}
          />

          <Metric
            label="Winning trades"
            value={result.winningTrades.toString()}
          />

          <Metric
            label="Losing trades"
            value={result.losingTrades.toString()}
          />

          <Metric
            label="Win rate"
            value={`${result.winRate.toFixed(1)}%`}
          />

          <Metric
            label="Average return / trade"
            value={`${result.averageReturn.toFixed(2)}%`}
          />

          <Metric
            label="Sum of trade returns"
            value={`${result.totalReturn.toFixed(2)}%`}
          />
        </div>
      </section>

      {/* AI LEARNING */}

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-sm font-medium text-green-600">
            02
          </p>

          <h3 className="mt-1 text-xl font-semibold text-gray-900">
            AI interpretation
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            The AI interprets the verified backtest results
            without calculating or inventing them.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Analyzing the experiment results...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {learning && !loading && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                Summary
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {learning.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Interpretation
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-700">
                {learning.interpretation}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* HYPOTHESIS */}

      <section className="mt-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Original hypothesis
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-700">
            {hypothesis}
          </p>
        </div>
      </section>

      {/* LIMITATIONS */}

      {learning && (
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-green-600">
              03
            </p>

            <h3 className="mt-1 text-xl font-semibold text-gray-900">
              Limitations
            </h3>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <ul className="space-y-3 text-sm leading-6 text-gray-700">
              {learning.limitations.map(
                (limitation, index) => (
                  <li key={index}>
                    • {limitation}
                  </li>
                )
              )}
            </ul>
          </div>
        </section>
      )}

      {/* NEXT QUESTIONS */}

      {learning && (
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-green-600">
              04
            </p>

            <h3 className="mt-1 text-xl font-semibold text-gray-900">
              Next questions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Follow-up experiments suggested from the
              current evidence.
            </p>
          </div>

          <div className="space-y-3">
            {learning.next_questions.map(
              (question, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-5 text-sm leading-6 text-gray-700 shadow-sm"
                >
                  {question}
                </div>
              )
            )}
          </div>
        </section>
      )}

      <div className="mt-8">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Test
        </button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}