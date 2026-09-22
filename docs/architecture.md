# MINDPRINT architecture

## Current scope

V0.2 remains intentionally client-side.

Browser
- React presentation
- 6-task production assessment
- 24-task research/development bank metadata
- deterministic production scoring
- EN/TR/ES/KO localization
- localStorage persistence

No server is required for the prototype.

## Boundaries

- src/components/: reusable visual and interaction primitives.
- src/pages/: screen composition; no answer keys or scoring formulas.
- src/assessment/tasks.ts: current six production tasks.
- src/assessment/task-bank/: language-independent research task metadata and candidate blueprints.
- src/assessment/locales/: localized presentation content for implemented production tasks.
- src/assessment/scoring.ts: deterministic production scoring only.
- src/i18n/: general UI localization and localized profile interpretation.
- src/lib/: generic infrastructure helpers.

The development bank is intentionally separate from the production task array. Adding a candidate to the bank must not make it appear in the live assessment.

## Deployment

The production output is the Vite dist directory. Vercel deploys the Vite application directly from main.

## Future data work

If consented research data is collected later, add a backend only after a specific privacy/data-retention design is approved. Do not silently add telemetry to the prototype. Task-bank telemetry fields describe potential research signals only; they do not collect data.
