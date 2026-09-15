"use client";
import { useState } from "react";
import ClarifyPanel from "@/components/ClarifyPanel";

import LearnPanel from "@/components/LearnPanel";

import type { ClarifyResult, SuggestedAssumptions } from "@/types/research";

import DefinePanel from "@/components/DefinePanel";

import type { BacktestResult } from "@/lib/backtest/runBacktest";

import TestPanel from "@/components/TestPanel";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState<ClarifyResult | null>(null);

  const [step, setStep] = useState<"ask" | "clarify">("ask");

  const [stage, setStage] = useState<
    "ask" | "clarify" | "define" | "test" | "learn"
  >("ask");

  const [confirmedAssumptions, setConfirmedAssumptions] =
    useState<SuggestedAssumptions | null>(null);

  const [testResult, setTestResult] = useState<BacktestResult | null>(null);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">ResearchLab</h1>
            <p className="text-sm text-gray-500">AI-powered trading research</p>
          </div>

          <div className="text-sm text-gray-500">
            ASK → CLARIFY → DEFINE → TEST → LEARN
          </div>
        </header>

        
          <section className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-3xl text-center">
              <p className="mb-3 text-sm font-medium text-green-600">
                AI Trading Research
              </p>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Turn a trading idea into a
                <span className="text-green-600"> testable experiment.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-gray-500">
                Start with a research question. We&apos;ll clarify the
                assumptions, define the experiment, test it against historical
                data, and explain what the data shows.
              </p>

              <div className="mt-10">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What do you want to investigate?"
                  className="min-h-32 w-full resize-none rounded-2xl border border-gray-200 p-5 text-left outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
                    {error}
                  </div>
                )}

                {result && stage === "clarify" && (
                  <ClarifyPanel
                    result={result}
                    onContinue={(assumptions) => {
                      setConfirmedAssumptions(assumptions);
                      setStage("define");
                    }}
                  />
                )}

                {result && confirmedAssumptions && stage === "define" && (
                  <DefinePanel
                    researchQuestion={result.research_question}
                    hypothesis={result.hypothesis}
                    assumptions={confirmedAssumptions}
                    onBack={() => {
                      setStage("clarify");
                    }}
                    onRun={async (experiment) => {
                      try {
                        setLoading(true);
                        setError("");

                        const response = await fetch("/api/research/test", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(experiment),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.error || "Experiment failed.");
                        }

                        setTestResult(data);
                        setStage("test");
                      } catch (err) {
                        console.error(err);

                        setError(
                          err instanceof Error
                            ? err.message
                            : "Experiment failed.",
                        );
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                )}

                {testResult && stage === "test" && (
                  <TestPanel
                    result={testResult}
                    onBack={() => {
                      setStage("define");
                    }}
                    onLearn={() => {
                      setStage("learn");
                    }}
                  />
                )}

                {testResult && result && stage === "learn" && (
                  <LearnPanel
                    result={testResult}
                    researchQuestion={result.research_question}
                    hypothesis={result.hypothesis}
                    onBack={() => {
                      setStage("test");
                    }}
                  />
                )}

                {/* {result && (
                <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left">
                  <h3 className="text-lg font-semibold">AI Analysis</h3>

                  <pre className="mt-4 overflow-auto whitespace-pre-wrap text-sm text-gray-600">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )} */}

                <button
                  onClick={async () => {
                    if (!question.trim()) return;

                    setLoading(true);
                    setError("");
                    setResult(null);

                    try {
                      const response = await fetch("/api/research/clarify", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          question,
                        }),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || "Something went wrong");
                      }

                      setResult(data);
                      setStage("clarify");
                      setStep("clarify");
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Something went wrong",
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze Question"}
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                Example: Does buying NIFTY after a sharp fall work?
              </p>
            </div>
          </section>
      
      </div>
    </main>
  );
}
