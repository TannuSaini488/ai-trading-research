export type MissingParameter = {
  name: string;
  question: string;
  why_it_matters: string;
};

export type SuggestedAssumptions = {
  market: string;
  condition: string;
  entry: string;
  exit: string;
  holding_period: string;
  test_period: string;
  cost_assumptions: string;
};

export type ClarifyResult = {
  research_question: string;
  missing_parameters: MissingParameter[];
  suggested_assumptions: SuggestedAssumptions;
  hypothesis: string;
};

export type Experiment = SuggestedAssumptions & {
  research_question: string;
  hypothesis: string;
};