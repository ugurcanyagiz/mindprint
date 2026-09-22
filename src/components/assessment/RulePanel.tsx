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
      <div className="max-w-[520px] border-y border-[var(--color-border)]">
        {examples.map((example) => (
          <div
            key={example.expression}
            className="grid min-h-[54px] grid-cols-[1fr_auto] items-center gap-8 border-b border-[var(--color-border)] py-3 last:border-b-0"
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
        className="mt-8 block text-[18px] font-medium tracking-[-0.02em]"
        htmlFor="rule-response"
      >
        {prompt}
      </label>
      <input
        id="rule-response"
        className="mt-3 w-full max-w-[180px] rounded-[9px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-lg tabular-nums outline-none transition-[border-color,box-shadow] focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
        type="number"
        inputMode="numeric"
        autoComplete="off"
        value={value ?? ""}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}
