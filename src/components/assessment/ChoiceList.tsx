import type { ChoiceOption } from "../../assessment/types";

type ChoiceListProps = {
  name: string;
  options: ChoiceOption[];
  value: string | null;
  onChange: (value: string) => void;
};

export function ChoiceList({
  name,
  options,
  value,
  onChange,
}: ChoiceListProps) {
  return (
    <fieldset className="border-y border-[var(--color-border)]">
      <legend className="sr-only">Select one response</legend>
      {options.map((option) => {
        const selected = option.id === value;

        return (
          <label
            key={option.id}
            className={[
              "flex min-h-[58px] cursor-pointer items-center gap-4 border-b border-[var(--color-border)] px-1 py-3.5 last:border-b-0",
              "transition-[background-color,color] duration-150",
              selected ? "bg-white/70" : "hover:bg-white/45",
            ].join(" ")}
          >
            <input
              className="h-4 w-4 shrink-0 accent-[var(--color-accent)]"
              type="radio"
              name={name}
              value={option.id}
              checked={selected}
              onChange={() => onChange(option.id)}
            />
            <span className="text-sm leading-6 text-[var(--color-foreground-soft)]">
              {option.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
