# MINDPRINT Experimental Battery

## Status

The experimental battery is an internal, English-first research form available
at the #experimental route. It is separate from the six-task production
assessment and does not produce a Cognitive Profile, percentile, IQ equivalent,
clinical interpretation, or population-normed result.

The purpose of this form is to turn selected research-bank blueprints into
pilot-ready behavioral task prototypes.

## Selected tasks

| Task | Target | Interaction | Key process data |
| --- | --- | --- | --- |
| reasoning-causal-01 | causal reasoning | automated-analysis judgment | answer, confidence, revisions |
| reasoning-base-rate-01 | base-rate reasoning | probability judgment | answer, confidence, revisions |
| adaptive-interference-01 | interference resistance | three-phase rule change | phase responses, old-rule errors |
| adaptive-feedback-01 | adaptation after feedback | two-phase policy revision | phase responses, confidence change |
| evidence-contradiction-01 | contradictory evidence | belief revision | initial/revised judgment and confidence |
| evidence-independence-01 | independence/conflict | evidence selection | selected evidence, confidence |
| filtering-signal-noise-01 | signal vs noise | dense metric selection | selected signals, confidence |
| filtering-salience-01 | misleading salience resistance | evidence judgment | answer, confidence |
| metacog-confidence-01 | confidence calibration | four sequential judgments | accuracy/confidence pairs |
| metacog-belief-revision-01 | belief revision | two-phase explanation update | belief and confidence change |
| transfer-cross-domain-01 | cross-domain transfer | principle application | answer, confidence |
| transfer-structural-analogy-01 | structural analogy | relational matching | answer, confidence |

## Why these twelve

The set samples two research candidates from each visible MINDPRINT dimension
while deliberately varying interaction structure. It includes uncertainty,
persuasive automated analysis, base-rate integration, feedback adaptation,
old-rule interference, source dependence, signal/noise filtering, belief
revision, confidence calibration, and two forms of transfer.

The selection is not an empirical short form. Task-bank difficulty labels and
cognitive targets remain development hypotheses.

## Interaction architecture

All experimental tasks use a phase-based domain model. A one-step choice is a
single phase; belief revision and feedback tasks use two phases; rule
interference uses three; confidence calibration uses four. Earlier phase
responses are committed before the next phase and are persisted locally.

The phase engine supports native single-choice responses, bounded
multi-selection, numeric responses, optional confidence capture, phase history,
answer revisions, initial and revised judgments, and confidence deltas.

No correct/incorrect feedback is shown.

## Session isolation

Experimental progress is stored under a dedicated localStorage key:
experimental-assessment-session.

It does not share the production assessment-session key. Refreshing the research
route restores the current experimental task, phase, draft answer, confidence,
and completed phase history without changing production progress.

## Diagnostics

Pure TypeScript helpers produce bounded research diagnostics such as objective
quality, calibration quality, revision quality, and evidence-selection quality.

These outputs are internal diagnostics only. They are not shown on the
completion screen and are not incorporated into the production scoring engine.

Response timing is retained through timestamps but is not treated as an
intelligence score or given direct scoring weight.

## Known confounds and pilot questions

The authoritative research bank continues to record expected confounds,
including numeracy, reading speed, scientific literacy, digital literacy,
domain familiarity, working memory, and language sensitivity.

Pilot work should ask:

1. Are task completion and abandonment rates acceptable?
2. Do any items show obvious floor or ceiling effects?
3. Do high-language-sensitivity items behave differently across language groups?
4. Does belief revision distinguish appropriate updating from indiscriminate switching?
5. Does confidence add information beyond correctness?
6. Do process signals such as revisions or phase errors add incremental value?
7. Are transfer items solved structurally or through unintended wording cues?
8. Does the 12-task form create fatigue that changes later-task performance?

## Production boundary

The public MINDPRINT path remains:

Landing → Begin Assessment → six production tasks → Cognitive Profile.

The experimental route is intentionally not linked from the landing page.
Candidate task results must not be described as validated, standardized,
diagnostic, clinical, IQ-equivalent, or population-normed.
