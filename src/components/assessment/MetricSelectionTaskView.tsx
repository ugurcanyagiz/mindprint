import type { MultiSelectTask } from "../../assessment/types";
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
};

export function MetricSelectionTaskView({
  task,
  answer,
  confidence,
  onAnswerChange,
  onConfidenceChange,
  onSubmit,
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
      <p className="mb-7 max-w-[620px] text-[15px] leading-7 text-[var(--color-muted)]">
        {task.context}
      </p>

      <div className="border-y border-[var(--color-border)]">
        {task.metrics.map((metric) => {
          const selected = answer.includes(metric.id);
          const atLimit = answer.length >= task.selectionLimit;
          const disabled = atLimit && !selected;

          return (
            <button
              key={metric.id}
              className={[
                "grid w-full grid-cols-[1fr_auto] items-center gap-6 border-b border-[var(--color-border)] px-1 py-4 text-left last:border-b-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus)]",
                disabled ? "cursor-not-allowed opacity-45" : "hover:bg-white/60",
              ].join(" ")}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggleMetric(metric.id)}
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <span
                  className={[
                    "grid h-4 w-4 place-items-center rounded-[4px] border",
                    selected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                      : "border-[#c8ced7] bg-white",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {selected ? (
                    <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                  ) : null}
                </span>
                {metric.label}
              </span>
              <span className="text-sm tabular-nums text-[var(--color-muted)]">
                {metric.value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-xl font-medium tracking-[-0.025em]">
          {task.prompt}
        </p>
        <span className="shrink-0 text-xs tabular-nums text-[var(--color-muted)]">
          {answer.length} / {task.selectionLimit}
        </span>
      </div>

      <ConfidenceInput
        value={confidence}
        onChange={onConfidenceChange}
      />

      <div className="mt-10 flex justify-end">
        <Button
          disabled={answer.length !== task.selectionLimit}
          onClick={onSubmit}
        >
          Continue
        </Button>
      </div>
    </TaskFrame>
  );
}
