import type { MultiSelectTask } from "../../assessment/types";
import type { UiMessages } from "../../i18n/types";
import { Button } from "../ui/Button";
import { ConfidenceInput } from "./ConfidenceInput";
import { TaskFrame } from "./TaskFrame";

type MetricSelectionTaskViewProps = {
  task: MultiSelectTask;
  answer: string[];
  confidence: number;
  onAnswerChange: (value: string[]) => void;
  onConfidenceChange: (value: number) => void;
  onSubmit: () => void;
  ui: UiMessages["assessment"];
};

export function MetricSelectionTaskView({
  task,
  answer,
  confidence,
  onAnswerChange,
  onConfidenceChange,
  onSubmit,
  ui,
}: MetricSelectionTaskViewProps) {
  const toggleMetric = (id: string) => {
    if (answer.includes(id)) {
      onAnswerChange(answer.filter((item) => item !== id));
      return;
    }

    if (answer.length < task.selectionLimit) {
      onAnswerChange([...answer, id]);
    }
  };

  return (
    <TaskFrame eyebrow={task.eyebrow} title={task.title}>
      <p className="max-w-[600px] text-[14px] leading-6 text-[var(--color-muted)]">
        {task.context}
      </p>
      <div className="mt-6 flex items-end justify-between gap-6">
        <p className="max-w-[590px] text-[18px] font-medium leading-7 tracking-[-0.02em]">
          {task.prompt}
        </p>
        <span className="shrink-0 pb-1 text-[11px] tabular-nums text-[var(--color-muted)]">
          {answer.length} / {task.selectionLimit}
        </span>
      </div>

      <div className="mt-5 border-y border-[var(--color-border)]">
        {task.metrics.map((metric) => {
          const selected = answer.includes(metric.id);
          const atLimit = answer.length >= task.selectionLimit;
          const disabled = atLimit && !selected;

          return (
            <button
              key={metric.id}
              className={[
                "grid min-h-[56px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[var(--color-border)] px-1 py-3 text-left last:border-b-0 sm:gap-6",
                "transition-[background-color,opacity] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]",
                selected ? "bg-white/70" : "hover:bg-white/45",
                disabled ? "cursor-not-allowed opacity-40" : "",
              ].join(" ")}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggleMetric(metric.id)}
            >
              <span className="flex min-w-0 items-center gap-3 text-sm font-medium">
                <span
                  className={[
                    "grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border",
                    selected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] bg-white",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {selected ? (
                    <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                  ) : null}
                </span>
                <span>{metric.label}</span>
              </span>
              <span className="text-sm tabular-nums text-[var(--color-muted)]">
                {metric.value}
              </span>
            </button>
          );
        })}
      </div>

      <ConfidenceInput
        value={confidence}
        onChange={onConfidenceChange}
        ui={ui}
      />

      <div className="mt-8 flex justify-end">
        <Button
          disabled={answer.length !== task.selectionLimit}
          onClick={onSubmit}
        >
          {ui.continue}
        </Button>
      </div>
    </TaskFrame>
  );
}
