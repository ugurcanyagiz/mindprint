import { simulationPrototypes } from "../assessment/simulations/prototypes";
import { buildPrototypeDiagnostics } from "../assessment/simulations/diagnostics";
import { DynamicAttentionView } from "../components/simulations/DynamicAttentionView";
import { EvidenceStreamView } from "../components/simulations/EvidenceStreamView";
import { HiddenSystemView } from "../components/simulations/HiddenSystemView";
import { Button } from "../components/ui/Button";
import { useSimulationSession } from "../hooks/useSimulationSession";

type Props = {
  onExit: () => void;
};

export function SimulationsPage({ onExit }: Props) {
  const controls = useSimulationSession();
  const { session } = controls;

  if (session.status === "not_started") {
    return (
      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-7">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <button
            type="button"
            onClick={onExit}
            className="text-[11px] text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Return to MINDPRINT
          </button>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[900px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[660px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Internal dynamic research
            </p>
            <h1 className="mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-0.05em] sm:text-[50px]">
              Cognitive simulations
            </h1>
            <p className="mt-5 text-[16px] leading-7 text-[var(--color-muted)]">
              Three research prototypes observe decisions across changing
              information, feedback, and evidence. They do not produce an IQ,
              percentile, diagnosis, or validated cognitive score.
            </p>

            <div className="mt-9 grid border-y border-[var(--color-border)] sm:grid-cols-3">
              {simulationPrototypes.map((prototype, index) => (
                <div
                  key={prototype.id}
                  className="border-b border-[var(--color-border)] py-4 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
                >
                  <p className="text-[10px] tabular-nums text-[var(--color-muted)]">
                    0{index + 1}
                  </p>
                  <p className="mt-1 text-sm font-medium">{prototype.title}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-[var(--color-muted)]">
              Step mode is used so the same event structure can remain
              accessible and auditable. Visual transitions respect reduced-motion
              preferences.
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
          <div className="w-full max-w-[650px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Dynamic research
            </p>
            <h1 className="mt-4 text-[38px] font-semibold tracking-[-0.05em] sm:text-[48px]">
              Simulation set complete
            </h1>
            <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
              {session.traces.length} behavioral trace records were stored
              locally across {diagnostics.length} prototypes. No score or
              interpretation is generated.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={onExit}>Return to MINDPRINT</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  controls.reset();
                }}
              >
                Reset research session
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const prototype = simulationPrototypes[session.currentPrototypeIndex];

  return (
    <main className="min-h-screen">
      <header className="mx-auto w-full max-w-[900px] px-5 pt-6 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tabular-nums text-[var(--color-muted)]">
              {session.currentPrototypeIndex + 1} / {simulationPrototypes.length}
            </span>
            <button
              type="button"
              onClick={onExit}
              className="text-[11px] text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[900px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-[700px]">
          {prototype.kind === "attention" ? (
            <DynamicAttentionView
              state={session.attention}
              onToggle={controls.toggleAttentionSignal}
              onAdvance={controls.advanceAttention}
              onConfidence={controls.setAttentionConfidence}
              onComplete={controls.completeAttention}
            />
          ) : prototype.kind === "hidden-system" ? (
            <HiddenSystemView
              state={session.hiddenSystem}
              onDraft={controls.setHiddenDraft}
              onConfidence={controls.setHiddenConfidence}
              onSubmit={controls.submitHidden}
            />
          ) : (
            <EvidenceStreamView
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
