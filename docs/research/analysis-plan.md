# MINDPRINT Analysis Plan

## Purpose

This document is an internal preregistration-style plan. Its purpose is to
reduce analytical flexibility before outcomes are reviewed. It is not a formal
public preregistration and does not establish validity.

Terminology:

- Observed: calculated from collected data.
- Hypothesized: an intended construct or relationship not yet established.
- Exploratory: not designated as a primary analysis before reviewing outcomes.
- Validated: reserved for claims supported by adequate evidence for the
  intended use.

Task-bank dimension and subfacet labels are intended construct targets, not
confirmed factor loadings.

## Primary research questions

1. Can participants complete the experimental tasks with acceptable missingness
   and without systematic interaction failures?
2. Do tasks show enough response variation to support further measurement work?
3. Do confidence judgments add interpretable information beyond correctness?
4. Do multi-phase tasks capture appropriate updating rather than indiscriminate
   answer switching?
5. Do tasks intended for the same dimension show preliminary shared signal
   without becoming redundant?
6. Are there obvious language, device, education, or digital-literacy risks
   requiring revision before larger validation work?

## Secondary questions

- Do revision and phase-error signals add information beyond final answers?
- Does later-task performance deteriorate in a way consistent with fatigue?
- Do dense evidence tasks behave differently on mobile and desktop?
- Are cross-domain transfer tasks being solved structurally rather than through
  wording cues?

## Primary descriptive metrics

At item level:

- attempted N;
- completed N;
- completion rate;
- missing rate;
- objective mean and variance;
- response-option distribution;
- confidence mean and variance;
- confidence–objective absolute calibration gap;
- median response duration;
- revision rate;
- phase-specific accuracy;
- belief-change rate where applicable;
- appropriate-revision rate where applicable;
- confidence-change distribution.

Binary proportion-correct values may be called item difficulty indices in the
classical-test-theory sense, but must not be described as intelligence
difficulty.

## Configurable item flags

Initial development defaults may flag:

- possible floor: objective mean <= 0.15;
- possible ceiling: objective mean >= 0.90;
- high missingness: missing rate >= 0.15.

These are review flags, not automatic deletion rules. Thresholds may be revised
before a study is locked, but must not be silently optimized after seeing
outcomes.

## Item discrimination

Planned diagnostics may include corrected item–total or item–remainder
correlation.

For dimension-level analysis, the item should be removed from the remainder
score before correlation to reduce circular inflation.

Discrimination is one piece of evidence only. A high correlation does not prove
construct validity, and a low correlation may reflect multidimensional task
requirements, restricted variance, or poor item design.

## Missing data

The following are analytically distinct:

- skipped;
- abandoned;
- incomplete phase;
- interrupted;
- missing confidence;
- completed incorrect response.

Research analysis must not automatically replace all missing responses with
zero. The treatment used for each analysis must be reported.

## Data-quality and exclusion rules

Automatic data-quality flags may identify:

- impossible negative duration;
- malformed required identifiers;
- duplicate participant/task records;
- incomplete or corrupted session records.

A participant is not excluded solely because of:

- fast responding;
- slow responding;
- unusual confidence;
- duplicate flags requiring reconciliation.

Speed alone is not a sufficient exclusion criterion.

Current framework exclusions are deliberately conservative: only explicit
corruption of required identifiers can create an automatic exclusion decision.
Additional exclusion rules must be defined before reviewing study outcomes.

## Reliability

Reliability should not be reduced to one alpha value.

Planned work includes:

- corrected item–remainder relationships;
- dimension-level consistency;
- task-family consistency;
- test–retest association;
- McDonald's omega;
- factor-based reliability estimates where appropriate.

Simple correlations can be calculated in the TypeScript research layer.
Omega and advanced factor-based estimates should be computed in a dedicated
R/Python statistical pipeline with model diagnostics.

## Dimensional structure

The six visible dimensions are hypotheses, not established latent factors.

Exploratory Factor Analysis may be used during exploratory work.

Confirmatory comparisons should be conducted on a sufficiently independent or
appropriately held-out sample when feasible. Candidate models include:

- one general factor;
- six correlated factors;
- higher-order general factor plus six dimensions;
- bifactor structure.

Model fit, interpretability, factor determinacy, cross-loadings, and sample
adequacy should be examined. The six-factor model must not be declared correct
in advance.

## IRT

IRT is not part of production scoring.

Potential future models include:

- Rasch / 1PL;
- 2PL;
- graded-response;
- partial-credit.

Suitability depends on dimensionality, local independence, item type, sample
size, item count, and model fit. Belief-revision and multi-phase tasks may not
fit conventional binary IRT without an appropriate response model.

## Convergent validity

Planned positive associations may be tested with established measures of:

- reasoning;
- confidence–accuracy calibration;
- probabilistic learning / rule switching;
- scientific reasoning or actively open-minded thinking.

Specific commercial instruments are not required by this framework.

## Discriminant validity

MINDPRINT should not simply reproduce:

- vocabulary;
- education;
- reading speed;
- digital familiarity;
- AI familiarity.

Related constructs may correlate; the question is whether intended MINDPRINT
signals remain distinguishable from these potential confounds.

## Incremental validity

A future core test is whether MINDPRINT adds information beyond conventional
reasoning/cognitive measures.

A generic model is:

Outcome ~ traditional cognitive measure + MINDPRINT dimensions

Potential outcomes include evidence judgment, misinformation detection, complex
decision performance, and adaptive task performance.

Incremental value must be demonstrated empirically before being claimed.

## Fairness and DIF

Planned grouping variables may include:

- assessment language;
- age band;
- education band;
- native/non-native test language;
- device class;
- digital-use frequency;
- AI-use frequency.

Potential analyses include DIF, group missingness, completion differences,
response-duration patterns, and option-selection patterns.

A group mean difference is not by itself proof of bias. A DIF flag is not by
itself proof of unfairness. Flagged items require substantive review.

## Cross-language analysis

EN, TR, ES, and KO forms must not be assumed equivalent.

Planned sequence:

1. translation review;
2. bilingual review;
3. cognitive interviewing;
4. item-level response comparison;
5. language DIF;
6. factor-structure comparison;
7. measurement-invariance analysis.

Potential invariance levels:

- configural: broadly similar factor pattern;
- metric: comparable loading structure;
- scalar: intercept/threshold structure sufficient for stronger mean
  comparisons.

Direct cross-language percentile or normative comparison is deferred until
adequate evidence exists.

## Device effects

Planned mobile/tablet/desktop comparisons include:

- completion;
- response duration;
- confidence use;
- dense evidence-selection performance;
- interaction-specific missingness.

Production scores must not be adjusted by device without empirical and
substantive justification.

## Item retention

No weighted magic score determines retention.

Each item receives human review across:

- psychometric signal;
- completion quality;
- redundancy;
- fairness risk;
- language risk;
- usability risk;
- construct coverage.

Allowed lifecycle statuses:

draft → pilot → review → retain / revise / retire

No existing task should receive retain or retire status merely from synthetic
fixture results.

## Confirmatory vs exploratory reporting

Primary analyses should be identified before outcome review. Analyses introduced
after observing unexpected patterns should be labeled exploratory.

All departures from the locked plan should be documented with date, rationale,
and affected analyses.
