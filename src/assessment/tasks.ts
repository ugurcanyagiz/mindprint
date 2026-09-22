import type { AssessmentTask, AssessmentTaskBlueprint } from "./types";

/**
 * Real assessment content belongs here (or in adjacent structured data
 * modules), never inline inside presentation components.
 *
 * Milestone 2 intentionally contains no real prompts, answers, or scoring keys.
 */
export const assessmentTasks: AssessmentTask[] = [];

export const assessmentBlueprints: AssessmentTaskBlueprint[] = [
  { id: "task-01", dimension: "informationFiltering", order: 1 },
  { id: "task-02", dimension: "reasoning", order: 2 },
  { id: "task-03", dimension: "evidenceEvaluation", order: 3 },
  { id: "task-04", dimension: "adaptiveLearning", order: 4 },
  { id: "task-05", dimension: "metacognitiveCalibration", order: 5 },
  { id: "task-06", dimension: "knowledgeTransfer", order: 6 },
];
