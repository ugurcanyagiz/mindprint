# MINDPRINT research task bank

## Status

This document defines the V0.2 research/development item bank. It is not a claim that MINDPRINT is a validated cognitive test. The production assessment remains the existing six-task short form.

The development bank contains 24 task definitions: 6 dimensions × 4 subfacets. Six entries correspond to the current production tasks; eighteen are candidate research blueprints that are not rendered to users yet.

## Measurement model

| Dimension | Internal subfacets |
| --- | --- |
| Reasoning | logical sufficiency; causal reasoning; quantitative reasoning; base-rate reasoning |
| Adaptive Learning | rule induction; rule revision; interference resistance; adaptation after feedback |
| Evidence Evaluation | source credibility; study-design quality; contradictory evidence; independence / conflict of interest |
| Information Filtering | signal vs noise; relevance selection; misleading salience resistance; information prioritization |
| Metacognitive Calibration | uncertainty recognition; confidence calibration; insufficient-information detection; belief revision |
| Knowledge Transfer | principle abstraction; cross-domain transfer; structural analogy; application under constraints |

The six dimensions remain the only user-facing score dimensions. Subfacets are research metadata, not additional result bars.

## Bank architecture

The research schema and controlled vocabularies live under src/assessment/task-bank/types.ts. The 24 language-independent definitions live in src/assessment/task-bank/bank.ts.

Production task presentation remains in src/assessment/tasks.ts and src/assessment/locales/. This separation is deliberate:

- current scoring continues to operate only on the six production tasks;
- candidate tasks can represent richer paradigms before a UI implementation exists;
- task IDs, answer identifiers, metadata, and scoring intentions remain language-independent;
- future pilot data can be analyzed against stable task/subfacet identifiers.

## Candidate matrix

| ID | Dimension / subfacet | Family | Difficulty | Intended scoring |
| --- | --- | --- | --- | --- |
| task-02-reasoning | Reasoning / logical sufficiency | AI judgment | medium | objective + calibration |
| reasoning-causal-01 | Reasoning / causal reasoning | causal reasoning | hard | objective + calibration |
| reasoning-quantitative-01 | Reasoning / quantitative reasoning | quantitative structure | medium | objective + calibration |
| reasoning-base-rate-01 | Reasoning / base-rate reasoning | base rate | hard | partial credit |
| adaptive-rule-induction-01 | Adaptive Learning / rule induction | rule change | easy | binary correctness |
| task-04-adaptive-rule | Adaptive Learning / rule revision | rule change | medium | phase-weighted adaptation |
| adaptive-interference-01 | Adaptive Learning / interference resistance | rule change | hard | phase-weighted adaptation |
| adaptive-feedback-01 | Adaptive Learning / adaptation after feedback | rule change | medium | phase-weighted adaptation |
| evidence-source-credibility-01 | Evidence Evaluation / source credibility | source comparison | medium | rank distance |
| task-03-evidence-evaluation | Evidence Evaluation / study-design quality | source comparison | medium | rank distance |
| evidence-contradiction-01 | Evidence Evaluation / contradictory evidence | belief revision | hard | belief-revision quality |
| evidence-independence-01 | Evidence Evaluation / independence/conflict | source comparison | medium | evidence-selection quality |
| filtering-signal-noise-01 | Information Filtering / signal vs noise | signal vs noise | medium | evidence-selection quality |
| filtering-relevance-01 | Information Filtering / relevance selection | signal vs noise | easy | evidence-selection quality |
| filtering-salience-01 | Information Filtering / misleading salience resistance | signal vs noise | hard | objective + calibration |
| task-01-information-filtering | Information Filtering / information prioritization | signal vs noise | medium | evidence-selection quality |
| metacog-uncertainty-01 | Metacognitive Calibration / uncertainty recognition | single decision | medium | objective + calibration |
| metacog-confidence-01 | Metacognitive Calibration / confidence calibration | confidence calibration | medium | objective + calibration |
| task-05-missing-information | Metacognitive Calibration / insufficient-information detection | single decision | easy | objective + calibration |
| metacog-belief-revision-01 | Metacognitive Calibration / belief revision | belief revision | hard | belief-revision quality |
| transfer-abstraction-01 | Knowledge Transfer / principle abstraction | knowledge transfer | medium | transfer quality |
| transfer-cross-domain-01 | Knowledge Transfer / cross-domain transfer | knowledge transfer | hard | transfer quality |
| transfer-structural-analogy-01 | Knowledge Transfer / structural analogy | knowledge transfer | hard | transfer quality |
| task-06-knowledge-transfer | Knowledge Transfer / application under constraints | knowledge transfer | medium | transfer quality |

## Signature paradigms

### Belief revision

The candidate bank includes phased judgments where an initial evidence set is plausible but incomplete and a later, stronger evidence set changes what should be believed. Future scoring should consider both directional belief change and confidence change. Merely changing an answer is not intrinsically good.

### AI judgment

AI-generated analysis is used as a presentation context, not as a target of blanket distrust. Candidate tasks should vary among supported, unsupported, incomplete, and overconfident analyses. The construct of interest is epistemic scrutiny proportional to evidence quality.

### Rule change and unlearning

Rule-learning candidates separate initial induction, explicit revision, interference from the obsolete rule, and adaptation from sparse feedback. The existing RIN task remains the production rule-revision item.

### Signal vs noise

Filtering candidates use dense but bounded information environments. Difficulty comes from plausible distractors and salience competition, not simply from more words.

### Knowledge transfer

Transfer candidates deliberately vary surface domain while preserving relational structure. Correct responses should not be recoverable by keyword matching.

## Difficulty

Difficulty is a design hypothesis, not an empirical item parameter. Candidate tasks use easy, medium, or hard as development labels. Intended difficulty drivers include distractor similarity, irrelevant-information density, evidence conflict, rule complexity, missing information, base-rate ambiguity, transfer distance, and confidence traps.

Pilot data must determine actual item difficulty and discrimination.

## Telemetry

The bank declares possible signals without collecting them. No analytics or backend is added by this milestone.

Potential fields include final answer, confidence, response time, revisions, ranking movements, selected evidence, information views, belief change, confidence change, phase transitions, and old-rule errors.

Response time is auxiliary process data, not an intelligence score. It should not receive substantial weight unless later validation demonstrates incremental measurement value and fairness.

## Confounds

Each task records plausible confounds such as numeracy, education, language proficiency, digital literacy, finance familiarity, scientific literacy, AI familiarity, reading speed, domain familiarity, and working memory.

These are hypotheses for validation and DIF/fairness analysis. They are not currently corrected or used to adjust individual scores.

## Language

Task-bank IDs, answer identifiers, subfacets, metadata, and scoring intentions are language-independent. Only the six production tasks currently have complete EN/TR/ES/KO presentation localization. Candidate localization should be added only when a candidate becomes an implemented experimental form.

Language versions should not be treated as psychometrically equivalent until cross-language measurement work supports that conclusion.

## Scoring preparation

The metadata can describe future strategies without changing the Milestone 5 engine:

- binary correctness
- partial credit
- rank distance
- confidence calibration
- belief-revision quality
- phase-weighted adaptation
- evidence-selection quality
- transfer quality

Actual formulas for candidate paradigms are intentionally deferred.

## Validation path

Before expanding the production short form, the recommended sequence is:

1. implement experimental forms for selected candidate tasks;
2. collect consented pilot data under a defined privacy/retention plan;
3. inspect completion, missingness, floor/ceiling effects, and item behavior;
4. estimate reliability and test-retest stability where appropriate;
5. test dimensional structure with factor-analytic methods;
6. evaluate item information / IRT suitability if sample size supports it;
7. examine differential item functioning and language/fairness effects;
8. study convergent and discriminant validity;
9. select or adapt the production short form only after empirical review.

Until that work exists, the bank remains a research/development framework and must not be described as an IQ equivalent, clinical result, population percentile, diagnostic assessment, or validated stable-trait measure.
