import type {
  InputMode,
  InstrumentationEvent,
  SimulationDeviceContext,
  SimulationTimingContext,
} from "./types";

export function createLocalResearchSessionId() {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return `sim_${globalThis.crypto.randomUUID()}`;
  }

  return `sim_${Date.now().toString(36)}`;
}

export function defaultDeviceContext(): SimulationDeviceContext {
  return {
    viewportWidthBand: "medium",
    inputMode: "unknown",
    deviceClass: "desktop",
    reducedMotion: false,
    pixelRatioBand: "standard",
  };
}

export function captureDeviceContext(): SimulationDeviceContext {
  if (typeof window === "undefined") {
    return defaultDeviceContext();
  }

  const width = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;

  return {
    viewportWidthBand:
      width < 640 ? "narrow" : width < 1200 ? "medium" : "wide",
    deviceClass: width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop",
    inputMode: "unknown",
    reducedMotion:
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
    pixelRatioBand:
      pixelRatio < 1.5
        ? "standard"
        : pixelRatio < 2.5
          ? "retina-like"
          : "high",
  };
}

export function withInputMode(
  context: SimulationDeviceContext,
  inputMode: InputMode,
): SimulationDeviceContext {
  return {
    ...context,
    inputMode,
  };
}

function hiddenDurationMs(events: InstrumentationEvent[], endMs: number) {
  const ordered = [...events]
    .filter((event) => event.type === "tab-hidden" || event.type === "tab-visible")
    .sort((a, b) => a.timestampMs - b.timestampMs);
  let hiddenAt: number | null = null;
  let hiddenTotal = 0;

  for (const event of ordered) {
    if (event.type === "tab-hidden" && hiddenAt === null) {
      hiddenAt = event.timestampMs;
    } else if (event.type === "tab-visible" && hiddenAt !== null) {
      hiddenTotal += Math.max(0, event.timestampMs - hiddenAt);
      hiddenAt = null;
    }
  }

  if (hiddenAt !== null) {
    hiddenTotal += Math.max(0, endMs - hiddenAt);
  }

  return hiddenTotal;
}

export function buildTimingContext(
  startedAt: string | null,
  completedAt: string | null,
  instrumentationEvents: InstrumentationEvent[],
  interruptionsDetected: boolean,
  nowMs = Date.now(),
): SimulationTimingContext {
  const startMs = startedAt ? new Date(startedAt).getTime() : null;
  const endMs = completedAt ? new Date(completedAt).getTime() : nowMs;
  const wallClockDurationMs =
    startMs !== null && Number.isFinite(startMs) && endMs >= startMs
      ? endMs - startMs
      : null;
  const hiddenMs =
    wallClockDurationMs === null
      ? 0
      : hiddenDurationMs(instrumentationEvents, endMs);

  return {
    timingSource:
      typeof performance !== "undefined" && typeof performance.now === "function"
        ? "performance-now"
        : "date-now",
    precision: "browser-contextual",
    backgroundTabDetected: instrumentationEvents.some(
      (event) => event.type === "tab-hidden",
    ),
    interruptionsDetected,
    wallClockDurationMs,
    activeDurationMs:
      wallClockDurationMs === null
        ? null
        : Math.max(0, wallClockDurationMs - hiddenMs),
  };
}
