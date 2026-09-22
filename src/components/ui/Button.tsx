import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClasses =
    variant === "primary"
      ? "border border-[var(--color-accent)] bg-[var(--color-accent)] text-white hover:border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-strong)]"
      : "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-foreground)] hover:bg-white";

  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 py-2.5 text-[13px] font-medium tracking-[-0.01em]",
        "transition-[background-color,border-color,color,opacity] duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variantClasses,
        className,
      ].join(" ")}
      {...props}
    />
  );
}
