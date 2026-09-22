import type { UiMessages } from "./types";

export const en: UiMessages = {
  accessibility: {
    homeLabel: "MINDPRINT home",
    languageLabel: "Language",
  },
  dimensions: {
    reasoning: "Reasoning",
    adaptiveLearning: "Adaptive Learning",
    evidenceEvaluation: "Evidence Evaluation",
    informationFiltering: "Information Filtering",
    metacognitiveCalibration: "Metacognitive Calibration",
    knowledgeTransfer: "Knowledge Transfer",
  },
  landing: {
    experimentalAssessment: "Experimental assessment",
    cognitiveAssessment: "Cognitive assessment",
    headline: "How do you think when the answer isn't obvious?",
    support:
      "MINDPRINT examines reasoning, adaptation, evidence judgment, and confidence through a short modern assessment.",
    beginAssessment: "Begin assessment",
    scope: "Scope",
    whatItMeasures: "What it measures",
    approach: "Approach",
    method: "Method",
    methodBody:
      "Short tasks introduce incomplete information, changing rules, conflicting evidence, and confidence judgments. Performance is summarized within the assessment itself.",
    experimentalByDesign: "Experimental by design.",
    disclaimer:
      "Not an IQ test, clinical instrument, diagnostic tool, or population percentile assessment.",
    version: "V0.1",
  },
  assessment: {
    label: "Assessment",
    introTitle: "A short series of decision tasks.",
    introBody:
      "Work at a natural pace. Some tasks ask how confident you are in your response.",
    duration: "Duration",
    durationValue: "~10 minutes",
    tasks: "Tasks",
    startAssessment: "Start assessment",
    exit: "Exit",
    continue: "Continue",
    confidence: "Confidence",
    low: "Low",
    high: "High",
    confidenceAriaValue: "{value} percent confident",
    selectOneResponse: "Select one response",
    progressLabel: "Assessment progress",
    ruleUpdate: "Rule update",
    principle: "Principle",
    automatedAnalysis: "Automated analysis",
    claim: "Claim",
    rankingInstructions:
      "1 = most influential. Use Up and Down to reorder.",
    moveUp: "Up",
    moveDown: "Down",
    moveUpLabel: "Move {item} up",
    moveDownLabel: "Move {item} down",
  },
  results: {
    headerLabel: "Cognitive profile",
    assessmentComplete: "Assessment complete",
    title: "Cognitive Profile",
    subtitle: "Performance summary from this assessment session.",
    averageConfidence: "Average confidence",
    responseAccuracy: "Response accuracy",
    calibrationGap: "Calibration gap",
    points: "pts",
    observedStrengths: "Observed strengths",
    confidenceCalibration: "Confidence calibration",
    assessmentNote: "Assessment note",
    retakeAssessment: "Retake assessment",
    copySummary: "Copy summary",
    copied: "Copied",
    preparing: "Preparing your cognitive profile",
    processingPerformance: "Summarizing task performance",
    processingCalibration: "Comparing confidence with observed accuracy",
    processingScores: "Preparing dimension scores",
    methodNote:
      "Method note: These scores summarize performance within this experimental prototype. They are not standardized IQ scores, clinical findings, or population percentiles. Language versions are localized for equivalent task intent, but cross-language score equivalence has not yet been established.",
    strengthEven:
      "Performance was relatively even across the measured dimensions within this assessment.",
    strengthComparative:
      "Your responses showed comparatively strong performance in {dimensions} within this assessment.",
    calibrationClose:
      "Your stated confidence tracked observed task performance closely overall.",
    calibrationSomeDistance:
      "Your stated confidence showed some distance from observed task performance.",
    calibrationNoticeable:
      "Your stated confidence varied noticeably from observed task performance across the calibrated tasks.",
    assessmentNoteBody:
      "Scores reflect performance in this six-task experimental prototype and should be read as task-level signals rather than stable traits.",
    summaryTitle: "MINDPRINT — Cognitive Profile",
  },
};
