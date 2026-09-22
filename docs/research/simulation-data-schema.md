# MINDPRINT Simulation Data Schema

## Hierarchy

Session → Form → Condition → Trial → Event → Trace → Observation → Quality Flag

## Session

A session contains:

- pseudonymous local researchSessionId;
- studyVersion;
- simulation mode;
- completion status;
- assigned form IDs;
- start/end/update timestamps;
- device context;
- instrumentation events.

## Form

Each form contains:

- stable language-independent ID;
- environment ID;
- form label;
- version;
- structural template ID;
- manipulation profile;
- intended development difficulty;
- mobile risk;
- validation status;
- parallel-form reference.

Development difficulty is a design hypothesis, not an empirical item parameter.

## Condition

Manipulation metadata describes the controlled structure used to interpret
behavior.

Examples:

Attention:
- relevant/irrelevant signal counts;
- salient distractor;
- interruption presence and magnitude.

Hidden System:
- stable/anomaly/change/transfer structure;
- old/new rule definitions.

Evidence:
- evidence count;
- strength/direction variation;
- strong-contradiction requirement.

## Trial

A trial is one participant response unit inside a form.

## Event

An event is an environment update such as:

- signal update;
- interruption;
- new evidence;
- feedback;
- true rule change.

## Trace

A CognitiveTrace is a raw interaction record.

Important fields include:

- ID;
- trace type;
- timestamp;
- environment;
- prototype/form relationship;
- trial/event IDs;
- structured payload.

Raw traces are not trait scores.

## Observation

A CognitiveObservation is deterministically derived from one or more raw traces.

It contains:

- deterministic observation ID;
- participant-session ID;
- environment/form IDs;
- hypothesized constructs;
- observation type;
- value;
- sourceTraceIds provenance;
- hypothesized interpretation status;
- observation-level quality flags.

Missing behavior remains missing. It is not silently converted into zero.

## Quality Flag

Quality flags describe research-data issues or context.

Every current flag has automaticExclusion=false.

## Research export

Current schema:

simulation-export-1.0

Export also includes:

- simulationEngineVersion;
- researchProtocolVersion;
- source = local-pilot-export;
- device context;
- timing context.

Dynamic trace records remain a separate schema from Milestone 13 task-response
records because forcing event streams into static task-response fields would
discard important structure.

The layers still share general research concepts such as versioning, completion
status, timestamps, and pseudonymous IDs.
