import type { DynamicConstructDefinition } from "./types";

export const DYNAMIC_INTELLIGENCE_HYPOTHESIS =
  "Static problem-solving ability is only one component of modern cognitive performance. Intelligence in dynamic information environments may additionally depend on attention allocation, rapid model formation, adaptive updating, metacognitive calibration, epistemic judgment, transfer, and appropriate use of cognitive tools.";

export const dynamicConstructModel: DynamicConstructDefinition[] = [
  {
    id: "modelFormation",
    label: "Model Formation",
    status: "hypothesized",
    subconstructs: [
      "fluid reasoning",
      "structural abstraction",
      "causal inference",
      "quantitative structure detection",
      "hypothesis formation",
      "rapid mental-model construction",
    ],
  },
  {
    id: "attentionControl",
    label: "Attention & Cognitive Control",
    status: "hypothesized",
    subconstructs: [
      "selective attention",
      "sustained attention",
      "distraction resistance",
      "inhibition",
      "attentional switching",
      "interruption recovery",
      "priority maintenance",
    ],
  },
  {
    id: "learningDynamics",
    label: "Learning Dynamics",
    status: "hypothesized",
    subconstructs: [
      "rule induction",
      "learning rate",
      "feedback sensitivity",
      "rule revision",
      "interference resistance",
      "unlearning",
      "volatility detection",
      "exploration versus exploitation",
      "retention",
      "transfer",
    ],
  },
  {
    id: "metacognitiveRegulation",
    label: "Metacognitive Regulation",
    status: "hypothesized",
    subconstructs: [
      "confidence calibration",
      "error awareness",
      "uncertainty recognition",
      "information-need recognition",
      "confidence updating",
      "overconfidence",
      "underconfidence",
      "decision threshold regulation",
    ],
  },
  {
    id: "epistemicJudgment",
    label: "Epistemic Judgment",
    status: "hypothesized",
    subconstructs: [
      "source credibility",
      "evidence hierarchy",
      "evidence independence",
      "contradiction handling",
      "misinformation resistance",
      "correlation versus causation",
      "base-rate integration",
      "belief revision",
    ],
  },
  {
    id: "knowledgeTransfer",
    label: "Knowledge Transfer",
    status: "hypothesized",
    subconstructs: [
      "principle abstraction",
      "near transfer",
      "far transfer",
      "structural analogy",
      "transfer under changed surface conditions",
      "transfer under constraints",
    ],
  },
  {
    id: "augmentedCognition",
    label: "Augmented Cognition",
    status: "hypothesized",
    subconstructs: [
      "appropriate AI reliance",
      "automation bias",
      "under-reliance",
      "verification behavior",
      "cognitive offloading",
      "tool-selection quality",
      "confidence transfer from AI",
      "detecting AI overconfidence",
      "overriding external assistance when warranted",
    ],
  },
];

export const generalDynamicCognitiveAbilityHypothesis = {
  id: "general-dynamic-cognitive-ability",
  status: "hypothesized" as const,
  note:
    "A possible future latent construct. No quotient, population norm, or general-factor score is produced by this architecture.",
};
