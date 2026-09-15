"use client";

import type { SuggestedAssumptions } from "@/types/research";

type Props = {
  researchQuestion: string;
  hypothesis: string;
  assumptions: SuggestedAssumptions;
  onBack: () => void;
  onRun: (experiment: SuggestedAssumptions) => void;
};

export default function DefinePanel({
  researchQuestion,
  hypothesis,
  assumptions,
  onBack,
  onRun,
}: Props) {
  return (
    <div className="mx-auto mt-10 w-full max-w-4xl text-left">
      <div className="mb-8">
        <p className="text-sm font-medium text-green-600">
          DEFINE
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Your research experiment
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          The clarified assumptions have been converted into a
          structured experiment. Review the design before running it.
        </p>
      </div>

      {/* Research Question */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Research question
        </p>

        <p className="mt-2 text-lg font-medium leading-7 text-gray-900">
          {researchQuestion}
        </p>
      </div>

      {/* Experiment Design */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Experiment design
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            These parameters define exactly what will be tested.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ExperimentField
            label="Market"
            value={assumptions.market}
          />

          <ExperimentField
            label="Condition"
            value={assumptions.condition}
          />

          <ExperimentField
            label="Entry"
            value={assumptions.entry}
          />

          <ExperimentField
            label="Exit"
            value={assumptions.exit}
          />

          <ExperimentField
            label="Holding period"
            value={assumptions.holding_period}
          />

          <ExperimentField
            label="Test period"
            value={assumptions.test_period}
          />

          <div className="sm:col-span-2">
            <ExperimentField
              label="Cost assumptions"
              value={assumptions.cost_assumptions}
            />
          </div>
        </div>
      </div>

      {/* Hypothesis */}
      <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-green-600">
          Hypothesis
        </p>

        <p className="mt-2 text-sm leading-6 text-gray-700">
          {hypothesis}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          ← Back to Clarify
        </button>

        <button
          onClick={() => onRun(assumptions)}
          className="rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Run Experiment →
        </button>
      </div>
    </div>
  );
}

type ExperimentFieldProps = {
  label: string;
  value: string;
};

function ExperimentField({
  label,
  value,
}: ExperimentFieldProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-800">
        {value}
      </p>
    </div>
  );
}