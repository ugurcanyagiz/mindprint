import type { RankingTask } from "../../assessment/types";
import { interpolate } from "../../i18n/messages";
import type { UiMessages } from "../../i18n/types";
import { Button } from "../ui/Button";
import { ConfidenceInput } from "./ConfidenceInput";
import { TaskFrame } from "./TaskFrame";

type RankingTaskViewProps = {
  task: RankingTask;
  answer: string[] | null;
  confidence: number;
  onAnswerChange: (value: string[]) => void;
  onConfidenceChange: (value: number) => void;
  onSubmit: (value: string[]) => void;
  ui: UiMessages["assessment"];
};

export function moveRankedItem(
  order: string[],
  index: number,
  direction: -1 | 1,
) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= order.length) {
    return order;
  }

  const next = [...order];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export function RankingTaskView({
  task,
  answer,
  confidence,
  onAnswerChange,
  onConfidenceChange,
  onSubmit,
  ui,
}: RankingTaskViewProps) {
  const initialOrder = task.items.map((item) => item.id);
  const order = answer ?? initialOrder;
  const itemsById = new Map(task.items.map((item) => [item.id, item]));

  const reorder = (index: number, direction: -1 | 1) => {
    onAnswerChange(moveRankedItem(order, index, direction));
  };

  return (
    <TaskFrame eyebrow={task.eyebrow} title={task.title}>
      <div className="border-l border-[var(--color-accent)] pl-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
          {ui.claim}
        </p>
        <p className="mt-2 text-[15px] leading-6 text-[var(--color-foreground-soft)]">
          {task.claim}
        </p>
      </div>

      <p className="mb-4 mt-7 text-[18px] font-medium leading-7 tracking-[-0.02em]">
        {task.prompt}
      </p>

      <ol
        className="border-y border-[var(--color-border)]"
        aria-describedby="ranking-instructions"
      >
        {order.map((id, index) => {
          const item = itemsById.get(id);

          if (!item) {
            return null;
          }

          return (
            <li
              key={item.id}
              className="grid min-h-[68px] grid-cols-[24px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-b border-[var(--color-border)] py-3.5 last:border-b-0 sm:grid-cols-[30px_minmax(0,1fr)_auto]"
            >
              <span className="text-[11px] tabular-nums text-[var(--color-muted-soft)]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-0.5 text-xs leading-5 text-[var(--color-muted)]">
                  {item.detail}
                </p>
              </div>

              <div className="col-start-2 flex flex-wrap items-center gap-0.5 sm:col-start-auto">
                <button
                  className="min-h-9 rounded-md px-2.5 py-1.5 text-[11px] text-[var(--color-muted)] transition-colors hover:bg-white hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-25"
                  type="button"
                  disabled={index === 0}
                  aria-label={interpolate(ui.moveUpLabel, { item: item.label })}
                  onClick={() => reorder(index, -1)}
                >
                  {ui.moveUp}
                </button>
                <button
                  className="min-h-9 rounded-md px-2.5 py-1.5 text-[11px] text-[var(--color-muted)] transition-colors hover:bg-white hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-25"
                  type="button"
                  disabled={index === order.length - 1}
                  aria-label={interpolate(ui.moveDownLabel, {
                    item: item.label,
                  })}
                  onClick={() => reorder(index, 1)}
                >
                  {ui.moveDown}
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <p
        id="ranking-instructions"
        className="mt-2.5 text-[11px] text-[var(--color-muted)]"
      >
        {ui.rankingInstructions}
      </p>

      <ConfidenceInput
        value={confidence}
        onChange={onConfidenceChange}
        ui={ui}
      />

      <div className="mt-8 flex justify-end">
        <Button onClick={() => onSubmit(order)}>{ui.continue}</Button>
      </div>
    </TaskFrame>
  );
}
