# MINDPRINT Research Data Dictionary

## Principles

The research schema is a future export format. The current product does not
send this information to a backend.

Privacy sensitivity uses:

- low: operational research metadata with limited personal relevance;
- moderate: pseudonymous behavioral or demographic context that should be
  protected;
- high: data not currently required and generally should not be collected
  without a specific justification.

## Participant context

| Field | Type | Meaning | Missing behavior | Scoring | Research-only | Sensitivity |
| --- | --- | --- | --- | --- | --- | --- |
| participantId | string | Pseudonymous research identifier | required | no | yes | moderate |
| studyVersion | string | Locked study/form version | required | no | yes | low |
| assessmentLanguage | en/tr/es/ko | Language used for the research form | required | no | yes | moderate |
| ageBand | string | Optional age range, not exact birth date | allowed missing | no | yes | moderate |
| educationBand | string | Optional education category | allowed missing | no | yes | moderate |
| primaryLanguage | string | Optional self-reported primary language | allowed missing | no | yes | moderate |
| digitalUseFrequency | string | Optional broad digital-use category | allowed missing | no | yes | moderate |
| aiUseFrequency | string | Optional broad AI-use category | allowed missing | no | yes | moderate |
| deviceClass | mobile/tablet/desktop | Coarse interaction device | allowed missing | no | yes | low |
| consentVersion | string | Consent text/version accepted for a real study | required for real pilot | no | yes | moderate |

## Task record

| Field | Type | Meaning | Unit / allowed values | Missing behavior | Scoring | Sensitivity |
| --- | --- | --- | --- | --- | --- | --- |
| participantId | string | Join key to participant context | pseudonymous | required | no | moderate |
| studyVersion | string | Study version | version string | required | no | low |
| taskId | string | Stable canonical task identifier | research bank ID | required | research diagnostics only | low |
| taskVersion | integer | Version of task content/logic | positive integer | required | research diagnostics only | low |
| dimension | enum | Intended visible construct target | six MINDPRINT dimensions | required | not proof of factor loading | low |
| subfacet | enum | Intended subfacet target | task-bank subfacet | required | not proof of construct validity | low |
| language | locale | Language of administration | en/tr/es/ko | required | no direct adjustment | moderate |
| completionStatus | enum | Task completion state | completed/skipped/abandoned/incomplete-phase/interrupted | required | research missingness rules | low |
| startedAt | ISO timestamp | Wall-clock start | UTC ISO 8601 | nullable | no | moderate |
| completedAt | ISO timestamp | Wall-clock end | UTC ISO 8601 | nullable | no | moderate |
| durationMs | number | Derived elapsed duration | milliseconds | nullable; negative invalid | process signal only | moderate |
| phaseResponses | array | Per-phase research records | structured | may be partial | research diagnostics | moderate |
| revisions | integer | Count of changed draft responses where available | count | default 0 | research signal only | moderate |
| selectedEvidence | string[] | Selected evidence IDs | canonical IDs | empty when not applicable | research signal only | moderate |
| rankingMovements | number/null | Ranking interaction moves if collected | count | null if not collected | research signal only | moderate |
| initialAnswer | response/null | First phase response | canonical IDs | null if unavailable | research diagnostics | moderate |
| revisedAnswer | response/null | Later response in updating tasks | canonical IDs | null if not applicable | research diagnostics | moderate |
| initialConfidence | number/null | First confidence judgment | 0–100 | null if not collected | research calibration | moderate |
| revisedConfidence | number/null | Later confidence judgment | 0–100 | null if not applicable | research calibration | moderate |
| beliefChanged | boolean/null | Whether string judgment changed across phases | boolean | null if not applicable | research signal only | moderate |
| confidenceDelta | number/null | Revised minus initial confidence | percentage points | null if unavailable | research signal only | moderate |
| source | synthetic/pilot | Origin marker | enum | required | no | low |

## Phase record

| Field | Type | Meaning | Unit | Missing behavior | Scoring | Sensitivity |
| --- | --- | --- | --- | --- | --- | --- |
| phaseId | string | Stable phase identifier | canonical ID | required | research diagnostics | low |
| answer | string/string[]/null | Response identifiers | canonical IDs | null if missing | research diagnostics | moderate |
| confidence | number/null | Stated confidence | 0–100 | null if not requested/missing | calibration analysis | moderate |
| objectiveQuality | number/null | Research evaluation helper output | 0–1 | null if unavailable | research diagnostics only | moderate |
| revisions | integer | Draft changes in phase | count | default 0 | process signal | moderate |
| startedAt | ISO timestamp/null | Wall-clock phase start | UTC ISO 8601 | nullable | no | moderate |
| completedAt | ISO timestamp/null | Wall-clock phase end | UTC ISO 8601 | nullable | no | moderate |
| durationMs | number/null | Derived phase duration | milliseconds | nullable; negative invalid | process signal only | moderate |

## Timing distinctions

Wall-clock timestamps indicate when an event occurred.

Duration is a derived elapsed value in milliseconds.

Response duration is process data. It is not an intelligence score and should
not receive direct production scoring weight without separate empirical and
fairness justification.

## Missingness

Missing is not equivalent to incorrect.

Analysis should preserve whether a task was skipped, abandoned, interrupted, or
incomplete. Missing confidence should remain distinct from a confidence value
of zero.

## Synthetic fixtures

Records with source = synthetic exist only for tests, edge cases, and
development calculations. They must never be combined with real pilot data as
if they were participant observations.
