# MINDPRINT Pilot Instrumentation

## Privacy boundary

Instrumentation exists only in the internal simulation research layer.

Milestone 15 adds no backend, account, authentication, analytics SDK, tracking
cookie, biometric collection, eye tracking, or browser fingerprint.

A local pseudonymous research-session identifier links records within one
simulation session.

## Session lifecycle

Supported states:

- not_started
- in_progress
- completed
- abandoned
- interrupted
- invalid

The current UI primarily uses not_started, in_progress, interrupted, and
completed. The broader status vocabulary is available for future pilot
operations.

Session state is persisted under:

dynamic-simulation-research-session

It remains separate from production and Experimental Battery storage.

Refresh can restore form assignment, trial/event progress, responses, and raw
traces.

## Deterministic form assignment

Form assignment is seed-based and reproducible.

The seed uses study version, local research-session ID, and environment ID.

No critical research ordering depends on uncontrolled Math.random() calls.

Counterbalancing helpers can generate A→B or B→A order for future repeated-form
studies.

## Device context

Coarse metadata only:

- viewport width band;
- mobile/tablet/desktop class;
- input mode: mouse/touch/keyboard/unknown;
- reduced-motion preference;
- coarse pixel-ratio band.

No high-entropy hardware fields are collected.

These fields are potential usability/confound metadata, not intelligence
signals.

## Timing

Timing source is recorded as browser-contextual.

Consumer browsers are not laboratory-grade reaction-time instruments.

Exports can distinguish:

- wall-clock duration;
- active duration after tab-hidden periods are removed.

Neither is converted into cognitive-speed scoring.

## Visibility events

document.visibility state can produce:

- tab-hidden
- tab-visible

instrumentation events.

A background-tab event creates a research quality flag rather than an automatic
exclusion or score correction.

For future real-time forms, a preregistered policy should decide whether hidden
segments are paused, invalidated, or flagged.

## Input mode

Pointer and keyboard activity update coarse input mode.

Input mode is used for usability and device-effect research only.

## Export flow

The internal completion screen can export local research JSON containing:

- version metadata;
- local session metadata;
- assigned forms;
- traces;
- derived observations;
- quality flags;
- coarse device context;
- timing context.

The export contains no percentile, IQ, final cognitive score, or participant
interpretation.
