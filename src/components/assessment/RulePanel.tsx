import type { RuleExample } from "../../assessment/types";

type RulePanelProps = {
  examples: RuleExample[];
  prompt: string;
  value: string | null;
  onChange: (value: string) => void;
};

export function RulePanel({
  examples,
  prompt,
  value,
  onChange,
}: RulePanelProps) {
  return (
    <div>
      <div className="border-y border-[var(--color-border)]">
        {examples.map((example) => (
          <div
            key={example.expression}
            className="grid grid-cols-[1fr_auto] items-center gap-8 border-b border-[var(--color-border)] py-4 last:border-b-0"
          >
            <span className="font-mono text-sm tracking-[-0.01em]">
              {example.expression}
            </span>
            <span className="font-mono text-sm text-[var(--color-muted)]">
              → {example.result}
            </span>
          </div>
        ))}
      </div>

      <label
        className="mt-9 block text-xl font-medium tracking-[-0.025em]"
        htmlFor="rule-response"
      >
        {prompt}
      </label>
      <input
        id="rule-response"
        className="mt-4 w-full max-w-[220px] rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-lg tabular-nums outline-none transition-colors focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/15"
        type="number"
        inputMode="numeric"
        autoComplete="off"
        value={value ?? ""}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}
