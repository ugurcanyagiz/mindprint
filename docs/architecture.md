# MINDPRINT architecture

## Current scope

V0.1 is intentionally a static client-side application.

```text
Browser
  ├─ React presentation
  ├─ Assessment task data
  ├─ Deterministic scoring
  └─ localStorage persistence
```

No server is required for the prototype.

## Boundaries

- `src/components/`: reusable visual and interaction primitives.
- `src/pages/`: screen composition; no answer keys or scoring formulas.
- `src/assessment/`: tasks, response types, scoring, versioning.
- `src/lib/`: generic infrastructure helpers.

## Deployment

The production output is the Vite `dist/` directory.

Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`

Vercel can also deploy the Vite app without a backend.

## Future data work

If anonymous research data is collected later, add a backend only after a
specific privacy/data-retention design is approved. Do not silently add
telemetry to the prototype.
