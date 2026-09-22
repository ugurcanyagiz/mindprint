import type { SimulationEvent } from "./types";

export function validateTimeline(events: SimulationEvent[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  let previousAt = -Infinity;

  for (const event of events) {
    if (ids.has(event.id)) {
      errors.push(`Duplicate event ID: ${event.id}`);
    }
    ids.add(event.id);

    if (event.at < previousAt) {
      errors.push(`Event order is not deterministic at ${event.id}`);
    }
    previousAt = event.at;
  }

  return errors;
}

export function eventAtStep(
  events: SimulationEvent[],
  step: number,
): SimulationEvent | null {
  return events[step] ?? null;
}

export function supportsSimulationMode(mode: "step" | "real-time") {
  return mode === "step" || mode === "real-time";
}
