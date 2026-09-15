"use client";

import { useState } from "react";
import type {
  ClarifyResult,
  SuggestedAssumptions,
} from "@/types/research";

type Props = {
  result: ClarifyResult;
  onContinue: (assumptions: SuggestedAssumptions) => void;
};

export default function ClarifyPanel({
  result,
  onContinue,
}: Props) {
  const [assumptions, setAssumptions] =
    useState<SuggestedAssumptions>(result.suggested_assumptions);

  function updateAssumption(
    field: keyof SuggestedAssumptions,
    value: string
  ) {
    setAssumptions((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl text-left">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-green-600">
          CLARIFY
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Let&apos;s make the research question testable.
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          The AI identified some decisions that can affect the
          experiment. Review and edit the suggested assumptions
          before continuing.
        </p>
      </div>

      {/* Research Question */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Research question
        </p>

        <p className="mt-2 text-lg font-medium leading-7 text-gray-900">
          {result.research_question}
        </p>
      </div>

      {/* Missing Parameters */}
      {result.missing_parameters.length > 0 && (
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">
              Decisions to review
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              These details were not fully specified in your
              original question.
            </p>
          </div>

          <div className="space-y-4">
            {result.missing_parameters.map((parameter) => (
              <div
                key={parameter.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h4 className="font-medium text-gray-900">
                  {parameter.name}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {parameter.question}
                </p>

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  <span className="font-medium">
                    Why it matters:
                  </span>{" "}
                  {parameter.why_it_matters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Assumptions */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Suggested baseline
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            These values were suggested by the AI. You can change
            any of them.
          </p>
        </div>

        <div className="space-y-4">
          <AssumptionField
            label="Market"
            value={assumptions.market}
            onChange={(value) =>
              updateAssumption("market", value)
            }
          />

          <AssumptionField
            label="Condition"
            value={assumptions.condition}
            onChange={(value) =>
              updateAssumption("condition", value)
            }
          />

          <AssumptionField
            label="Entry"
            value={assumptions.entry}
            onChange={(value) =>
              updateAssumption("entry", value)
            }
          />

          <AssumptionField
            label="Exit"
            value={assumptions.exit}
            onChange={(value) =>
              updateAssumption("exit", value)
            }
          />

          <AssumptionField
            label="Holding period"
            value={assumptions.holding_period}
            onChange={(value) =>
              updateAssumption("holding_period", value)
            }
          />

          <AssumptionField
            label="Test period"
            value={assumptions.test_period}
            onChange={(value) =>
              updateAssumption("test_period", value)
            }
          />

          <AssumptionField
            label="Cost assumptions"
            value={assumptions.cost_assumptions}
            onChange={(value) =>
              updateAssumption("cost_assumptions", value)
            }
          />
        </div>
      </div>

      {/* Hypothesis */}
      <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-green-600">
          Hypothesis
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          {result.hypothesis}
        </p>
      </div>

      {/* Continue */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onContinue(assumptions)}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Continue to Define →
        </button>
      </div>
    </div>
  );
}

type AssumptionFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function AssumptionField({
  label,
  value,
  onChange,
}: AssumptionFieldProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}