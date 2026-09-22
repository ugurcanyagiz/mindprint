import type {
  ExperimentalDraftAnswer,
  ExperimentalTask,
  ExperimentalTaskState,
} from "../../assessment/experimental/types";
import { toggleExperimentalSelection } from "../../assessment/experimental/session";
import { getUiMessages } from "../../i18n/messages";
import { ChoiceList } from "../assessment/ChoiceList";
import { ConfidenceInput } from "../assessment/ConfidenceInput";
import { TaskFrame } from "../assessment/TaskFrame";
import { Button } from "../ui/Button";

type ExperimentalTaskViewProps = {
  task: ExperimentalTask;
  state: ExperimentalTaskState;
  onDraftChange: (answer: ExperimentalDraftAnswer) => void;
  onConfidenceChange: (confidence: number) => void;
  onSubmit: () => void;
};

function selectedArray(answer: ExperimentalDraftAnswer) {
  return Array.isArray(answer) ? answer : [];
}

export function ExperimentalTaskView({
  task,
  state,
  onDraftChange,
  onConfidenceChange,
  onSubmit,
}: ExperimentalTaskViewProps) {
  const phase = task.phases[state.phaseIndex];
  const ui = getUiMessages("en").assessment;
  const response = phase.response;
  const multiResponse = response.kind === "multi-select" ? response : null;
  const selected = selectedArray(state.draftAnswer);

  const canContinue =
    multiResponse !== null
      ? selected.length === multiResponse.selectionLimit
      : typeof state.draftAnswer === "string" &&
        state.draftAnswer.trim().length > 0;

  return (
    <TaskFrame
      eyebrow={
        task.phases.length > 1
          ? `Step ${state.phaseIndex + 1} of ${task.phases.length}`
          : "Research task"
      }
      title={task.title}
    >
      {phase.heading ? (
        <p
          className="mb-6 text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-accent)]"
          aria-live="polite"
        >
          {phase.heading}
        </p>
      ) : null}

      {phase.analysis ? (
        <div className="mb-7 border-y border-[var(--color-border)] py-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {phase.analysis.label}
          </p>
          <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-[var(--color-foreground-soft)]">
            “{phase.analysis.text}”
          </p>
        </div>
      ) : null}

      {phase.principle ? (
        <div className="mb-7 border-l border-[var(--color-accent)] pl-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
            Principle
          </p>
          <p className="mt-2 max-w-[650px] text-[15px] leading-7 text-[var(--color-foreground-soft)]">
            {phase.principle}
          </p>
        </div>
      ) : null}

      {phase.context ? (
        <div className="mb-7 border-y border-[var(--color-border)] py-4.5">
          {phase.context.map((line) => (
            <p
              key={line}
              className="text-sm leading-7 text-[var(--color-foreground-soft)]"
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}

      {phase.examples ? (
        <div className="mb-7 max-w-[520px] border-y border-[var(--color-border)]">
          {phase.examples.map((example) => (
            <div
              key={example.expression}
              className="grid min-h-[52px] grid-cols-[1fr_auto] items-center gap-8 border-b border-[var(--color-border)] py-3 last:border-b-0"
            >
              <span className="font-mono text-sm">{example.expression}</span>
              <span className="font-mono text-sm text-[var(--color-muted)]">
                → {example.result}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mb-5 max-w-[650px] text-[18px] font-medium leading-7 tracking-[-0.02em]">
        {phase.prompt}
      </p>

      {phase.response.kind === "single-choice" ? (
        <ChoiceList
          name={`${task.id}-${phase.id}`}
          options={phase.response.options}
          value={
            typeof state.draftAnswer === "string"
              ? state.draftAnswer
              : null
          }
          onChange={onDraftChange}
          legend="Select one response"
        />
      ) : null}

      {phase.response.kind === "numeric" ? (
        <input
          className="w-full max-w-[190px] rounded-[9px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-lg tabular-nums outline-none transition-[border-color,box-shadow] focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
          type="number"
          inputMode="numeric"
          autoComplete="off"
          aria-label={phase.prompt}
          value={
            typeof state.draftAnswer === "string"
              ? state.draftAnswer
              : ""
          }
          onChange={(event) => onDraftChange(event.currentTarget.value)}
        />
      ) : null}

      {multiResponse ? (
        <div className="border-y border-[var(--color-border)]">
          {multiResponse.items.map((item) => {
                const checked = selected.includes(item.id);
                const disabled =
                  selected.length >= multiResponse.selectionLimit &&
                  !checked;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={checked}
                    disabled={disabled}
                    className={[
                      "grid w-full grid-cols-[20px_minmax(0,1fr)] gap-3 border-b border-[var(--color-border)] px-1 py-3.5 text-left last:border-b-0",
                      "transition-[background-color,opacity] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]",
                      checked ? "bg-white/70" : "hover:bg-white/45",
                      disabled ? "cursor-not-allowed opacity-40" : "",
                    ].join(" ")}
                    onClick={() =>
                      onDraftChange(
                        toggleExperimentalSelection(
                          selected,
                          item.id,
                          multiResponse.selectionLimit,
                        ),
                      )
                    }
                  >
                    <span
                      className={[
                        "mt-0.5 grid h-4 w-4 place-items-center rounded-[4px] border",
                        checked
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                          : "border-[var(--color-border-strong)] bg-white",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {checked ? (
                        <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {item.label}
                        {item.value ? (
                          <span className="ml-2 font-normal tabular-nums text-[var(--color-muted)]">
                            {item.value}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-[var(--color-muted)]">
                        {item.detail}
                      </span>
                    </span>
                  </button>
                );
              })}
        </div>
      ) : null}

      {multiResponse ? (
        <p className="mt-2.5 text-[11px] text-[var(--color-muted)]">
          {selected.length} / {multiResponse.selectionLimit} selected
        </p>
      ) : null}

      {phase.confidenceRequired ? (
        <ConfidenceInput
          value={state.confidence}
          onChange={onConfidenceChange}
          ui={ui}
        />
      ) : null}

      <div className="mt-8 flex justify-end">
        <Button disabled={!canContinue} onClick={onSubmit}>
          {state.phaseIndex < task.phases.length - 1
            ? "Continue"
            : "Complete task"}
        </Button>
      </div>
    </TaskFrame>
  );
}
