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
    <fieldset className="space-y-3">
      <legend className="sr-only">Select one response</legend>
      {options.map((option) => {
        const selected = option.id === value;

        return (
          <label
            key={option.id}
            className={[
              "flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-4 transition-colors duration-150 sm:px-5",
              selected
                ? "border-[var(--color-accent)] bg-white"
                : "border-[var(--color-border)] bg-white hover:border-[#cbd2dc]",
            ].join(" ")}
          >
            <input
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
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
