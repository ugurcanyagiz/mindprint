import type { SingleChoiceTask } from "../../assessment/types";
import type { UiMessages } from "../../i18n/types";
import { Button } from "../ui/Button";
import { ChoiceList } from "./ChoiceList";
import { ConfidenceInput } from "./ConfidenceInput";
import { TaskFrame } from "./TaskFrame";

type SingleChoiceTaskViewProps = {
  task: SingleChoiceTask;
  answer: string | null;
  confidence: number;
  onAnswerChange: (value: string) => void;
  onConfidenceChange: (value: number) => void;
  onSubmit: () => void;
  ui: UiMessages["assessment"];
};

export function SingleChoiceTaskView({
  task,
  answer,
  confidence,
  onAnswerChange,
  onConfidenceChange,
  onSubmit,
  ui,
}: SingleChoiceTaskViewProps) {
  return (
    <TaskFrame eyebrow={task.eyebrow} title={task.title}>
      {task.principle ? (
        <div className="mb-8 border-l-2 border-[var(--color-accent)] pl-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {ui.principle}
          </p>
          <p className="mt-3 max-w-[620px] text-[16px] leading-7 text-[var(--color-foreground-soft)]">
            {task.principle}
          </p>
        </div>
      ) : null}

      {task.analysis ? (
        <div className="mb-8 border-y border-[var(--color-border)] py-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {ui.automatedAnalysis}
          </p>
          <p className="mt-3 max-w-[650px] text-[16px] leading-7 text-[var(--color-foreground-soft)]">
            “{task.analysis}”
          </p>
        </div>
      ) : null}

      {task.context ? (
        <div className="mb-8 border-y border-[var(--color-border)] py-5">
          {task.context.map((line) => (
            <p
              key={line}
              className="text-sm leading-7 text-[var(--color-foreground-soft)]"
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}

      <p className="mb-5 text-xl font-medium tracking-[-0.025em]">
        {task.prompt}
      </p>

      <ChoiceList
        name={task.id}
        options={task.options}
        value={answer}
        onChange={onAnswerChange}
        legend={ui.selectOneResponse}
      />

      {task.confidenceRequired ? (
        <ConfidenceInput
          value={confidence}
          onChange={onConfidenceChange}
          ui={ui}
        />
      ) : null}

      <div className="mt-10 flex justify-end">
        <Button disabled={!answer} onClick={onSubmit}>
          {ui.continue}
        </Button>
      </div>
    </TaskFrame>
  );
}
