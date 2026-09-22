# MINDPRINT Simulation Validation

## Status

Milestone 15 upgrades the three dynamic prototypes into controlled experimental
instrument candidates. It does not validate the constructs and it does not
produce an intelligence quotient, percentile, diagnosis, or trait score.

The implemented environments remain:

- Dynamic Attention Field
- Hidden-System Learning
- Dynamic Evidence Stream

Each now has Form A and Form B parallel-form candidates.

Parallel-form equivalence is a hypothesis to be tested empirically.

## Instrument model

Environment Family → Form → Condition → Trial → Event → Trace → Derived Observation

Instrument validation is kept separate from participant evaluation.

## Manipulation validation

### Dynamic Attention

Code-level checks verify:

- eight total signals;
- two diagnostic signals;
- a distinct non-diagnostic salient distractor;
- exactly one interruption;
- distractor peak consistency with metadata;
- deterministic event order.

Pilot questions:

- Does the salient distractor alter selection behavior?
- Is diagnostic selection similar across Form A and Form B?
- Are mobile and desktop patterns meaningfully different?
- Is the interruption noticeable without overwhelming the task?
- Is repeated diagnostic selection sufficiently stable?

### Hidden-System Learning

Both forms contain:

- an initial stable rule;
- an explicit one-off anomaly;
- a return to the old stable rule;
- a true structural rule change;
- post-change trials;
- a transfer probe.

The anomaly and the true rule change are explicitly different conditions.

Two limited rule-hypothesis checkpoints are included. They are intentionally not
shown on every trial because repeated introspection could alter the learning
process.

Pilot questions:

- Can participants learn the initial rule?
- Can they distinguish an anomaly from a persistent change?
- Is there measurable old-rule perseveration?
- Are learning curves comparable across Forms A/B?
- Does the transfer probe avoid floor/ceiling effects?

### Dynamic Evidence Stream

Both forms contain four sequential evidence events with variation in direction
and evidential strength plus at least one strong contradiction.

Evidence has structured research metadata for independence, study quality,
sample information, conflict of interest, evidential direction/strength, and
experimental diagnostic weight.

Diagnostic weight is experimental ground-truth structure, not an empirical
truth claim about the outside world.

Pilot questions:

- Does stronger evidence produce larger belief updates than weak evidence?
- Does strong contradictory evidence move judgment more than weak supportive
  evidence?
- Are Form A/B update trajectories similar?
- Does confidence change meaningfully with evidence?
- Does topic familiarity dominate results?

## Derived observations

Raw traces and observations are distinct.

Examples include:

- diagnostic-selection-quality;
- distractor-capture;
- post-interruption-priority-retention;
- pre-change accuracy;
- anomaly overreaction;
- post-change accuracy;
- transfer success;
- change-detection trial;
- belief-update count;
- strong-contradiction sensitivity;
- confidence after strong evidence;
- final judgment.

Each observation stores the raw trace IDs used to derive it.

Observation IDs are deterministic and derivation is idempotent.

Derived observations remain research observations and must not be presented as
validated traits.

## Quality flags

Supported quality flags include:

- background-tab;
- invalid-event-order;
- missing-confidence;
- incomplete-form;
- duplicate-trace;
- unsupported-trace;
- timing-anomaly;
- form-validation-warning.

A quality flag is not an automatic participant exclusion.

## Reliability readiness

Potential future analyses:

Dynamic Attention:
- parallel-form reliability
- split-condition consistency
- test-retest

Hidden-System Learning:
- learning-curve parameter stability
- parallel-form reliability
- test-retest with practice-effect controls

Dynamic Evidence Stream:
- parallel-form belief-update consistency
- confidence-update stability
- test-retest

No reliability coefficient is claimed in Milestone 15.
