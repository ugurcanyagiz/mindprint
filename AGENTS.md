# MINDPRINT — Codex project instructions

## Product

MINDPRINT is a professional **experimental cognitive assessment** prototype.

It explores how a participant reasons, adapts, evaluates evidence, filters
information, calibrates confidence, and transfers learned principles.

### Never claim

- that MINDPRINT is an IQ test
- scientific or clinical validation that has not been established
- diagnosis, fitness, intelligence ranking, or population percentile
- "smarter than X%" or equivalent normative claims without validated norming

Scores in V0.x are **within-assessment performance scores only**.

## Product tone

The experience should feel like a credible modern research/assessment product,
not a game, entertainment quiz, or personality test. Use calm, precise,
neutral language.

## Visual direction

Reference qualities: Apple restraint, Linear clarity, modern research software.

Core tokens:

- background: #F7F8FA
- foreground: #111827
- muted text: #6B7280
- accent: #243B64
- secondary accent/focus: #315C8C
- border: #E5E7EB

Prefer generous whitespace, excellent typography, 1px borders, 8–12px radii,
minimal shadows, subtle transitions, strong keyboard focus states, and
responsive layouts from 320px upward.

Avoid XP, levels, streaks, badges, confetti, neon, glassmorphism, excessive
gradients, emoji-driven UI, cartoon illustrations, and "brain score" gimmicks.

## Architecture rules

1. Keep assessment content out of React presentation components.
2. Store tasks, answer keys, weights, and metadata under `src/assessment/`.
3. Keep scoring deterministic and isolated from React.
4. React components render assessment data; they do not own answer keys.
5. Persist resumable progress client-side with localStorage.
6. V0.x has no backend, database, authentication, analytics SDK, or paid API
   unless explicitly requested.
7. Do not add a dependency when a small accessible implementation is clearer.
8. No correctness feedback between assessment tasks.
9. Confidence inputs must be keyboard and screen-reader accessible.
10. Respect `prefers-reduced-motion`.

## Engineering quality

Before considering a task complete:

```bash
npm run check
npm run build
```

Fix errors rather than suppressing TypeScript checks.

## Planned milestones

1. Foundation and landing page
2. Assessment shell + progress persistence
3. Information filtering / reasoning / evidence tasks
4. Adaptive learning / metacognition / transfer tasks
5. Deterministic scoring engine + tests
6. Cognitive Profile results
7. Accessibility + responsive QA
8. Static deployment

Do not jump across multiple milestones unless the user explicitly asks.
