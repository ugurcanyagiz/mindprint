import type { ExperimentalTask } from "./types";

export const experimentalTaskIds = [
  "reasoning-causal-01",
  "reasoning-base-rate-01",
  "adaptive-interference-01",
  "adaptive-feedback-01",
  "evidence-contradiction-01",
  "evidence-independence-01",
  "filtering-signal-noise-01",
  "filtering-salience-01",
  "metacog-confidence-01",
  "metacog-belief-revision-01",
  "transfer-cross-domain-01",
  "transfer-structural-analogy-01",
] as const;

/**
 * English experimental content.
 *
 * Task IDs and answer identifiers are language-independent. This file is kept
 * separate from React so additional locale content can be introduced later.
 */
export const experimentalTasks: ExperimentalTask[] = [
  {
    id: "reasoning-causal-01",
    title: "Evaluate an automated conclusion.",
    diagnosticMode: "standard",
    phases: [
      {
        id: "judgment",
        analysis: {
          label: "Automated analysis",
          text:
            "Conversion increased 18% after a recommendation model launched. The model caused the improvement and should be expanded immediately.",
        },
        context: [
          "During the same two weeks, prices were reduced by 8%.",
          "A new onboarding flow was released.",
          "Paid traffic shifted toward returning customers.",
        ],
        prompt: "What is the most appropriate response to the analysis?",
        response: {
          kind: "single-choice",
          options: [
            { id: "accept", label: "Accept the conclusion" },
            {
              id: "verify",
              label: "Verify the reported 18% increase, then accept the causal conclusion",
            },
            {
              id: "challenge",
              label: "Challenge the causal conclusion because several changes could explain the increase",
            },
            {
              id: "need-more-evidence",
              label: "Ignore the result until a much larger conversion increase appears",
            },
          ],
        },
        answerKey: "challenge",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "reasoning-base-rate-01",
    title: "Interpret a rare-event alert.",
    diagnosticMode: "standard",
    phases: [
      {
        id: "judgment",
        context: [
          "Only 2% of devices in a fleet develop a particular hardware fault.",
          "A detector catches 90% of faulty devices.",
          "It also flags 10% of healthy devices.",
          "One device receives a positive alert.",
        ],
        prompt: "Which conclusion is best supported?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "almost-certain",
              label: "The device is almost certainly faulty because the detector is 90% sensitive",
            },
            {
              id: "base-rate-qualified",
              label: "The alert raises concern, but with such a low base rate many positive alerts can still be false positives",
            },
            {
              id: "no-information",
              label: "The alert provides no useful information because false positives exist",
            },
            {
              id: "exactly-half",
              label: "The device has exactly a 50% chance of being faulty",
            },
          ],
        },
        answerKey: "base-rate-qualified",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "adaptive-interference-01",
    title: "Track a changing transformation.",
    diagnosticMode: "adaptation",
    phases: [
      {
        id: "rule-a",
        heading: "Initial rule",
        examples: [
          { expression: "ZOR + 2", result: "9" },
          { expression: "ZOR + 4", result: "13" },
          { expression: "ZOR + 6", result: "17" },
        ],
        prompt: "ZOR + 5 → ?",
        response: { kind: "numeric" },
        answerKey: "15",
        confidenceRequired: false,
      },
      {
        id: "rule-b",
        heading: "Rule update",
        examples: [
          { expression: "ZOR + 2", result: "8" },
          { expression: "ZOR + 4", result: "12" },
          { expression: "ZOR + 6", result: "16" },
        ],
        prompt: "Under the updated rule, ZOR + 5 → ?",
        response: { kind: "numeric" },
        answerKey: "14",
        confidenceRequired: false,
      },
      {
        id: "interference",
        heading: "Final probe",
        context: [
          "Continue using the updated rule.",
        ],
        prompt: "ZOR + 3 → ?",
        response: { kind: "numeric" },
        answerKey: "10",
        confidenceRequired: false,
      },
    ],
  },
  {
    id: "adaptive-feedback-01",
    title: "Update a policy from feedback.",
    diagnosticMode: "adaptation",
    phases: [
      {
        id: "initial-policy",
        context: [
          "A routing system sends some codes through Fast and others through Standard.",
          "Recent feedback: A7 → Fast was correct; B7 → Standard was correct; A4 → Standard was correct; B4 → Fast was correct.",
        ],
        prompt: "Which rule best explains the feedback?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "letter-number-interaction",
              label: "A codes go Fast when odd; B codes go Fast when even",
            },
            {
              id: "all-odd-fast",
              label: "All odd-numbered codes go Fast",
            },
            {
              id: "all-a-fast",
              label: "All A codes go Fast",
            },
            {
              id: "number-only",
              label: "Codes 4 and below go Fast",
            },
          ],
        },
        answerKey: "letter-number-interaction",
        confidenceRequired: true,
      },
      {
        id: "updated-policy",
        heading: "New feedback",
        context: [
          "The routing criterion has changed.",
          "A7 → Standard is now correct; B7 → Fast is correct; A4 → Fast is correct; B4 → Standard is correct.",
        ],
        prompt: "Which rule now best explains the feedback?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "flipped-interaction",
              label: "A codes go Fast when even; B codes go Fast when odd",
            },
            {
              id: "retain-old-rule",
              label: "Keep the previous rule",
            },
            {
              id: "all-even-fast",
              label: "All even-numbered codes go Fast",
            },
            {
              id: "letter-only",
              label: "All B codes go Fast",
            },
          ],
        },
        answerKey: "flipped-interaction",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "evidence-contradiction-01",
    title: "Update a judgment as evidence changes.",
    diagnosticMode: "belief-revision",
    phases: [
      {
        id: "initial-evidence",
        context: [
          "An independent randomized pilot with 120 participants reports a 15% improvement in recall after using a study technique.",
          "The confidence interval is wide, but the study followed its preregistered analysis.",
        ],
        prompt: "How strongly should the claim be supported at this point?",
        response: {
          kind: "single-choice",
          options: [
            { id: "strong-support", label: "Strong support" },
            { id: "tentative-support", label: "Tentative support" },
            { id: "neutral", label: "No evidential value" },
            { id: "reject", label: "Strong reason to reject the claim" },
          ],
        },
        answerKey: "tentative-support",
        confidenceRequired: true,
      },
      {
        id: "new-evidence",
        heading: "New evidence",
        context: [
          "A preregistered multicenter randomized trial with 4,200 participants tests the same technique.",
          "It finds no meaningful improvement in recall, with a narrow confidence interval around the null effect.",
        ],
        prompt: "How should the claim now be judged?",
        response: {
          kind: "single-choice",
          options: [
            { id: "retain-strong", label: "Strong support remains" },
            { id: "retain-tentative", label: "Tentative support remains unchanged" },
            { id: "low-support", label: "Support should decrease substantially" },
            { id: "ignore-new", label: "Ignore the larger trial because the first study was positive" },
          ],
        },
        answerKey: "low-support",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "evidence-independence-01",
    title: "Identify independent evidence.",
    diagnosticMode: "evidence-selection",
    phases: [
      {
        id: "selection",
        context: [
          "A company says its battery is safer than competitors. Six sources are cited.",
        ],
        prompt: "Select the TWO sources that provide the strongest independent evidence.",
        response: {
          kind: "multi-select",
          selectionLimit: 2,
          items: [
            {
              id: "company-study",
              label: "Company safety study",
              detail: "Commissioned and analyzed by the manufacturer",
            },
            {
              id: "press-article",
              label: "Technology news article",
              detail: "Summarizes the company's press release",
            },
            {
              id: "partner-blog",
              label: "Retail partner blog",
              detail: "Repeats figures supplied by the manufacturer",
            },
            {
              id: "independent-audit",
              label: "Independent engineering audit",
              detail: "Tests purchased retail units using a published protocol",
            },
            {
              id: "trade-post",
              label: "Industry association post",
              detail: "Links back to the commissioned company study",
            },
            {
              id: "independent-dataset",
              label: "Regulator incident analysis",
              detail: "Uses independently collected field-safety records",
            },
          ],
        },
        answerKey: ["independent-audit", "independent-dataset"],
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "filtering-signal-noise-01",
    title: "Find the diagnostic signals.",
    diagnosticMode: "evidence-selection",
    phases: [
      {
        id: "selection",
        context: [
          "A digital service slows down every evening. The team wants to know whether the bottleneck is processing capacity rather than simply more visitors.",
        ],
        prompt: "Select the TWO metrics with the highest diagnostic value.",
        response: {
          kind: "multi-select",
          selectionLimit: 2,
          items: [
            { id: "visitors", label: "Unique visitors", detail: "+31%" },
            { id: "social", label: "Social mentions", detail: "+84%" },
            { id: "queue-depth", label: "Processing queue depth", detail: "+240% at slowdown onset" },
            { id: "pageviews", label: "Page views", detail: "+28%" },
            { id: "service-time", label: "Median job service time", detail: "2.1× longer during slowdown" },
            { id: "new-users", label: "New-user signups", detail: "+19%" },
            { id: "email", label: "Marketing email opens", detail: "+44%" },
            { id: "support", label: "Support tickets", detail: "+36%" },
            { id: "logo", label: "Homepage logo impressions", detail: "+30%" },
            { id: "followers", label: "Follower growth", detail: "+7%" },
          ],
        },
        answerKey: ["queue-depth", "service-time"],
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "filtering-salience-01",
    title: "Separate vivid evidence from diagnostic evidence.",
    diagnosticMode: "standard",
    phases: [
      {
        id: "judgment",
        context: [
          "A highly shared customer video shows an app freezing for 40 seconds after an update.",
          "Across 600,000 sessions, repeated telemetry shows no change in freeze rate but a consistent 35% increase in API timeout errors.",
          "Device crash logs remain at their previous baseline.",
        ],
        prompt: "Which evidence should drive the investigation first?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "viral-video",
              label: "The viral freeze video because it is vivid and widely shared",
            },
            {
              id: "diagnostic-pattern",
              label: "The repeated API timeout pattern because it changes consistently across many sessions",
            },
            {
              id: "crash-logs",
              label: "The unchanged crash logs because they are technical data",
            },
            {
              id: "all-equal",
              label: "Treat all three pieces of evidence as equally diagnostic",
            },
          ],
        },
        answerKey: "diagnostic-pattern",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "metacog-confidence-01",
    title: "Match confidence to evidence strength.",
    diagnosticMode: "standard",
    phases: [
      {
        id: "certain-logic",
        context: [
          "Every Kelm is a Tor. No Tor is a Vek.",
        ],
        prompt: "Can any Kelm be a Vek?",
        response: {
          kind: "single-choice",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
            { id: "unknown", label: "Cannot be determined" },
          ],
        },
        answerKey: "no",
        confidenceRequired: true,
      },
      {
        id: "ambiguous-cause",
        context: [
          "A store changed its layout on Monday. Sales rose on Tuesday.",
          "No information is available about promotions, traffic, or competing events.",
        ],
        prompt: "Did the layout change cause the sales increase?",
        response: {
          kind: "single-choice",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
            { id: "unknown", label: "Cannot be determined" },
          ],
        },
        answerKey: "unknown",
        confidenceRequired: true,
      },
      {
        id: "certain-quantity",
        context: [
          "A fixed queue contains 40 jobs. Ten are completed and no new jobs arrive.",
        ],
        prompt: "How many jobs remain?",
        response: {
          kind: "single-choice",
          options: [
            { id: "20", label: "20" },
            { id: "30", label: "30" },
            { id: "40", label: "40" },
          ],
        },
        answerKey: "30",
        confidenceRequired: true,
      },
      {
        id: "weak-evidence",
        context: [
          "Three users report that a new interface feels faster.",
          "No timing measurements have been collected.",
        ],
        prompt: "Is the interface objectively faster?",
        response: {
          kind: "single-choice",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
            { id: "unknown", label: "Cannot be determined" },
          ],
        },
        answerKey: "unknown",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "metacog-belief-revision-01",
    title: "Reconsider a working explanation.",
    diagnosticMode: "belief-revision",
    phases: [
      {
        id: "initial",
        context: [
          "A fraud-monitoring system flags a cluster of transactions from Region A.",
          "A small manual review finds 8 fraudulent transactions among 20 flagged cases.",
          "No comparison sample from other regions has been reviewed yet.",
        ],
        prompt: "Which judgment is most appropriate now?",
        response: {
          kind: "single-choice",
          options: [
            { id: "initial-a-tentative", label: "Region A may deserve additional investigation, but the evidence is preliminary" },
            { id: "region-a-proven", label: "Region A is proven to be the cause of the fraud increase" },
            { id: "ignore", label: "The flags should be ignored completely" },
            { id: "system-failed", label: "The monitoring system has definitely failed" },
          ],
        },
        answerKey: "initial-a-tentative",
        confidenceRequired: true,
      },
      {
        id: "revision",
        heading: "New evidence",
        context: [
          "A larger blinded review examines 2,000 flagged cases across all regions.",
          "Fraud rates are similar across regions.",
          "The strongest predictor is a newly compromised payment processor used nationally.",
        ],
        prompt: "Which judgment is now most appropriate?",
        response: {
          kind: "single-choice",
          options: [
            { id: "keep-region-a", label: "Keep Region A as the primary explanation" },
            { id: "updated-b", label: "Shift the working explanation toward the compromised processor" },
            { id: "no-fraud", label: "Conclude that fraud is not occurring" },
            { id: "first-sample", label: "Prefer the first sample because it was reviewed earlier" },
          ],
        },
        answerKey: "updated-b",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "transfer-cross-domain-01",
    title: "Apply a principle in a different domain.",
    diagnosticMode: "transfer",
    phases: [
      {
        id: "transfer",
        principle:
          "When a system has a predictable peak and fixed capacity, moving flexible demand away from that peak can improve flow without increasing capacity.",
        context: [
          "A clinic has the same number of rooms and clinicians all month.",
          "Every weekday from 8–10 AM, urgent walk-ins compete with routine blood draws, paperwork visits, and scheduled follow-ups.",
          "The clinic cannot add rooms or staff this quarter.",
        ],
        prompt: "Which action best applies the principle?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "redistribute-nonurgent-demand",
              label: "Move flexible routine appointments and non-urgent procedures outside the morning peak",
            },
            {
              id: "shorter-urgent",
              label: "Limit every urgent visit to five minutes regardless of need",
            },
            {
              id: "more-signage",
              label: "Add more waiting-room signage during the peak",
            },
            {
              id: "hide-wait",
              label: "Stop displaying estimated wait times",
            },
          ],
        },
        answerKey: "redistribute-nonurgent-demand",
        confidenceRequired: true,
      },
    ],
  },
  {
    id: "transfer-structural-analogy-01",
    title: "Match systems by structure.",
    diagnosticMode: "transfer",
    phases: [
      {
        id: "analogy",
        context: [
          "Source system: Three teams depend on one specialist for final approval. Work accumulates before that specialist even though the teams themselves have spare capacity.",
        ],
        prompt: "Which situation has the most similar underlying structure?",
        response: {
          kind: "single-choice",
          options: [
            {
              id: "same-category",
              label: "Three software teams use different programming languages but have similar project sizes",
            },
            {
              id: "structural-match",
              label: "Several train lines feed into a single-track tunnel where trains queue despite open track elsewhere",
            },
            {
              id: "surface-match",
              label: "A manager approves vacation requests for three teams, but approvals are rare and never delayed",
            },
            {
              id: "distributed",
              label: "Several warehouses each have their own independent loading dock",
            },
          ],
        },
        answerKey: "structural-match",
        confidenceRequired: true,
      },
    ],
  },
];

export const EXPERIMENTAL_TASK_COUNT = experimentalTasks.length;
