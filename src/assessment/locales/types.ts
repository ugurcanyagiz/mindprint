export type AssessmentTaskLocalization = {
  eyebrow: string;
  title: string;
  context?: string | string[];
  prompt?: string;
  analysis?: string;
  principle?: string;
  metrics?: Record<string, string>;
  options?: Record<string, string>;
  items?: Record<string, { label: string; detail: string }>;
  phaseA?: { prompt: string };
  phaseB?: { prompt: string };
};

export type AssessmentLocaleContent = Record<
  string,
  AssessmentTaskLocalization
>;
