# MINDPRINT Validation Roadmap

## Principle

Validation is an accumulating evidence program, not a single milestone or
coefficient. Evidence must be specific to the intended interpretation and use
of MINDPRINT.

The current product remains an experimental assessment with a research task
bank and pilot-ready battery.

## Stage 1 — usability and cognitive interviewing

Goal: determine whether participants understand tasks and interactions as
intended.

Outputs:

- wording revisions;
- unintended-clue review;
- accessibility/mobile issues;
- qualitative reasoning-path notes;
- versioned task updates.

No psychometric validity claim should result from this stage.

## Stage 2 — initial quantitative pilot

Goal: characterize item behavior.

Outputs:

- completion and missingness;
- response distributions;
- confidence/calibration distributions;
- floor/ceiling review;
- phase behavior;
- item/remainder associations;
- preliminary redundancy review;
- exploratory dimensional patterns.

## Stage 3 — test–retest and parallel-form development

Goal: determine temporal stability while separating stability from memory and
practice effects.

Work:

- repeat testing after a planned interval;
- examine score and confidence stability;
- quantify practice effects;
- develop parallel forms for fixed-answer tasks where needed.

## Stage 4 — dimensional validation

Goal: test whether observed structure supports the intended score model.

Sequence:

- exploratory factor analysis when appropriate;
- confirmatory comparison of plausible models;
- one-factor versus six-correlated-factor alternatives;
- higher-order and bifactor alternatives where theoretically justified;
- replication or hold-out confirmation where feasible.

The existence of six named dimensions in the UI is not evidence that six latent
factors exist.

## Stage 5 — IRT suitability and item-bank modeling

Before fitting IRT, assess:

- dimensionality;
- local independence;
- response scale;
- sample size and precision;
- item count;
- model fit.

Possible models include Rasch/1PL, 2PL, graded-response, and partial-credit.
Multi-phase updating tasks may require different models or remain outside a
single conventional IRT bank.

## Stage 6 — convergent and discriminant validity

Convergent work should compare intended constructs with relevant established
measures.

Discriminant work should examine whether scores are overly explained by
vocabulary, education, reading speed, digital familiarity, or AI familiarity.

## Stage 7 — incremental validity

Test whether MINDPRINT explains useful variance in relevant modern decision
outcomes after conventional cognitive measures are included.

No claim of unique modern-cognition value should be made before this evidence
exists.

## Stage 8 — fairness and DIF

Evaluate task behavior across relevant groups.

Possible grouping variables:

- language;
- age band;
- education;
- native/non-native language status;
- device;
- digital literacy/use;
- AI familiarity/use.

DIF is a diagnostic flag requiring substantive interpretation, not an automatic
unfairness verdict.

## Stage 9 — cross-language equivalence

For EN/TR/ES/KO:

1. expert translation review;
2. bilingual review;
3. cognitive interviews;
4. item response comparison;
5. language DIF;
6. factor-structure comparison;
7. configural invariance;
8. metric invariance;
9. scalar invariance where stronger group comparisons are intended.

Normative or percentile comparisons across languages remain out of scope until
the required level of equivalence is supported.

## Stage 10 — production short-form selection

Only after empirical review should candidate tasks be considered for the public
short form.

Selection should balance:

- construct coverage;
- measurement signal;
- non-redundancy;
- usability;
- fairness;
- language portability;
- reasonable completion burden.

A statistically strong but conceptually narrow or unfair item should not
automatically be preferred.

## Statistical environment

The TypeScript layer is suitable for:

- schema validation;
- descriptive item metrics;
- missingness;
- calibration summaries;
- simple correlations;
- deterministic quality flags.

A dedicated R/Python analysis pipeline is preferred for:

- omega;
- EFA/CFA;
- bifactor/higher-order models;
- IRT calibration;
- DIF models;
- measurement invariance;
- simulation/power work;
- robust standard errors and advanced missing-data models.
