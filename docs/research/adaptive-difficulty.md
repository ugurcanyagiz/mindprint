# MINDPRINT Adaptive Difficulty

## Purpose

Dynamic difficulty is an experimental manipulation system, not an intelligence
estimator.

The engine does not implement the conventional rule:

correct → harder  
wrong → easier

as its only adaptation logic.

Instead it can change specific environmental properties in response to an
observed performance pattern.

## Difficulty vector

Every dynamic environment can describe a bounded 0–1 manipulation vector:

- informationDensity
- distractorSimilarity
- volatility
- uncertainty
- transferDistance
- interruptionLoad
- ruleComplexity

These values are design parameters. They are not empirical item-difficulty
estimates.

## Deterministic adaptation rules

Rules are versionable, testable, and auditable. The same TraceSummary produces
the same adjustments.

Current research examples:

### Filtering pressure

Pattern:
good outcome quality plus weak signal-selection quality.

Adjustment:
increase information density and distractor similarity.

Rationale:
probe filtering under stronger competition rather than simply speeding up the
task.

### Calibration probe

Pattern:
high rate of high-confidence errors.

Adjustment:
increase uncertainty.

Rationale:
create a stronger metacognitive-calibration condition without treating
confidence itself as intelligence.

### Interference probe

Pattern:
frequent post-rule-change errors.

Adjustment:
increase volatility and slightly increase rule complexity.

Rationale:
probe updating and competing-rule interference.

## Safeguards

The adaptive engine:

- does not output a cognitive score;
- does not output an IQ equivalent;
- does not output a percentile;
- does not use black-box machine learning;
- does not assume it knows the participant's intelligence level;
- only selects or modifies a future experimental condition;
- keeps parameters bounded;
- keeps a research rationale attached to every rule.

## Future extension

Additional rules may be added for:

- correct outcomes with low confidence;
- efficient evidence selection but weak updating;
- excessive information seeking under clear evidence;
- strong static reasoning but weak transfer;
- appropriate versus inappropriate AI reliance.

Any new rule should be preregistered or version-locked before confirmatory pilot
analysis where practical.
