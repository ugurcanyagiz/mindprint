import { PILOT_PROTOCOL_VERSION } from "../../research/protocol";
import {
  assignedForms,
  type SimulationResearchSession,
} from "../session";
import { deriveObservations } from "./observations";
import { deriveQualityFlags } from "./quality";
import { buildTimingContext } from "./instrumentation";
import type { SimulationResearchExport } from "./types";

export const SIMULATION_EXPORT_SCHEMA_VERSION = "simulation-export-1.0";
export const SIMULATION_ENGINE_VERSION = "dynamic-engine-0.2";

export function buildSimulationResearchExport(
  session: SimulationResearchSession,
): SimulationResearchExport {
  const forms = assignedForms(session);
  const observations = deriveObservations(session);
  const qualityFlags = deriveQualityFlags(session);
  const timingContext = buildTimingContext(
    session.startedAt,
    session.completedAt,
    session.instrumentationEvents,
    session.traces.some((trace) => trace.type === "interruption"),
  );

  return {
    schemaVersion: SIMULATION_EXPORT_SCHEMA_VERSION,
    simulationEngineVersion: SIMULATION_ENGINE_VERSION,
    researchProtocolVersion: PILOT_PROTOCOL_VERSION,
    source: "local-pilot-export",
    session: {
      researchSessionId: session.researchSessionId,
      studyVersion: session.studyVersion,
      status: session.status,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      mode: session.mode,
    },
    forms: forms.map((form) => ({
      id: form.id,
      environmentId: form.environmentId,
      version: form.version,
      formLabel: form.formLabel,
      structuralTemplateId: form.structuralTemplateId,
    })),
    traces: [...session.traces].sort((a, b) => a.id.localeCompare(b.id)),
    observations,
    qualityFlags: [...qualityFlags].sort((a, b) => a.id.localeCompare(b.id)),
    deviceContext: session.deviceContext,
    timingContext,
  };
}

export function serializeSimulationResearchExport(
  session: SimulationResearchSession,
) {
  return JSON.stringify(buildSimulationResearchExport(session), null, 2);
}
