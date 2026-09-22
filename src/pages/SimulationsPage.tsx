import {
  attentionForm,
  attentionPrototype,
  evidenceForm,
  evidencePrototype,
  hiddenPrototype,
  hiddenSystemForm,
} from "../assessment/simulations/session";
import { simulationPrototypes } from "../assessment/simulations/prototypes";
import { buildPrototypeDiagnostics } from "../assessment/simulations/diagnostics";
import { serializeSimulationResearchExport } from "../assessment/simulations/validation/export";
import { DynamicAttentionView } from "../components/simulations/DynamicAttentionView";
import { EvidenceStreamView } from "../components/simulations/EvidenceStreamView";
import { HiddenSystemView } from "../components/simulations/HiddenSystemView";
import { SimulationProgress } from "../components/simulations/SimulationProgress";
import { Button } from "../components/ui/Button";
import { useSimulationSession } from "../hooks/useSimulationSession";

type Props = {
  onExit: () => void;
};

function exportResearchJson(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

const prototypeDescriptions = [
  "Track changing signals and resist salient distraction.",
  "Infer a hidden rule, tolerate anomalies, and adapt when it changes.",
  "Update judgment and confidence as evidence quality changes.",
];

export function SimulationsPage({ onExit }: Props) {
  const controls = useSimulationSession();
  const { session } = controls;

  if (session.status === "not_started") {
    return (
      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-[980px] items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-7">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <button
            type="button"
            onClick={onExit}
            className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Return to MINDPRINT
          </button>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[980px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[780px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Internal dynamic research
            </p>
            <h1 className="mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[54px]">
              Cognitive simulations
            </h1>
            <p className="mt-5 max-w-[700px] text-[16px] leading-7 text-[var(--color-muted)]">
              Three interactive environments observe how decisions change with
              attention, feedback, and evidence. Each section shows exactly what
              can be selected and keeps your current choice visible.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {simulationPrototypes.map((prototype, index) => (
                <div
                  key={prototype.id}
                  className="rounded-[14px] border border-[var(--color-border)] bg-white p-4"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface)] text-[11px] font-bold text-[var(--color-accent)]">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-semibold">{prototype.title}</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                    {prototypeDescriptions[index]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5">
              <p className="text-xs leading-5 text-[var(--color-foreground-soft)]">
                <strong>How to use it:</strong> selected responses are shown with
                a dark outline, filled indicator, and “Selected” label. Step mode
                is used for accessibility and auditability.
              </p>
            </div>

            <p className="mt-5 text-xs leading-5 text-[var(--color-muted)]">
              This research form does not generate an IQ, percentile, diagnosis,
              or validated cognitive score.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={controls.begin}>Begin simulations</Button>
              <Button variant="secondary" onClick={onExit}>
                Return to MINDPRINT
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (session.status === "completed") {
    const diagnostics = buildPrototypeDiagnostics(session);

    return (
      <main className="min-h-screen">
        <section className="mx-auto flex min-h-screen w-full max-w-[900px] items-center px-5 py-20 sm:px-8">
          <div className="w-full max-w-[650px] rounded-[16px] border border-[var(--color-border)] bg-white p-6 sm:p-8">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-white">
              ✓
            </div>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Dynamic research
            </p>
            <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.05em] sm:text-[48px]">
              Simulation set complete
            </h1>
            <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
              {diagnostics.length} simulations completed · {session.traces.length}{" "}
              behavioral traces stored locally. No cognitive score or
              interpretation is generated.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={onExit}>Return to MINDPRINT</Button>
              <Button
                variant="secondary"
                onClick={() =>
                  exportResearchJson(
                    `mindprint-${session.researchSessionId}.json`,
                    serializeSimulationResearchExport(session),
                  )
                }
              >
                Export research JSON
              </Button>
              <Button variant="secondary" onClick={controls.reset}>
                Reset session
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const index = session.currentPrototypeIndex;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[color:var(--color-background)]/95 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[980px] px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] font-semibold tracking-[0.24em]">
              MINDPRINT
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium tabular-nums text-[var(--color-muted)]">
                Simulation {index + 1} of 3
              </span>
              <button
                type="button"
                onClick={onExit}
                className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
              >
                Exit
              </button>
            </div>
          </div>
          <div className="mt-4">
            <SimulationProgress currentIndex={index} />
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[980px] px-5 pb-20 pt-10 sm:px-8 sm:pt-12">
        <div className="max-w-[760px]">
          {index === 0 ? (
            <DynamicAttentionView
              prototype={attentionPrototype(session)}
              formLabel={attentionForm(session).formLabel}
              state={session.attention}
              onToggle={controls.toggleAttentionSignal}
              onAdvance={controls.advanceAttention}
              onConfidence={controls.setAttentionConfidence}
              onComplete={controls.completeAttention}
            />
          ) : index === 1 ? (
            <HiddenSystemView
              prototype={hiddenPrototype(session)}
              formLabel={hiddenSystemForm(session).formLabel}
              state={session.hiddenSystem}
              onDraft={controls.setHiddenDraft}
              onHypothesis={controls.setHiddenHypothesis}
              onConfidence={controls.setHiddenConfidence}
              onSubmit={controls.submitHidden}
            />
          ) : (
            <EvidenceStreamView
              prototype={evidencePrototype(session)}
              formLabel={evidenceForm(session).formLabel}
              state={session.evidence}
              onDecision={controls.setEvidenceDecision}
              onConfidence={controls.setEvidenceConfidence}
              onSubmit={controls.submitEvidence}
            />
          )}
        </div>
      </section>
    </main>
  );
}
