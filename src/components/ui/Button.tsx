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
      ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]"
      : "border border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:bg-[var(--color-surface)]";

  return (
    <button
      type={type}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses,
        className,
      ].join(" ")}
      {...props}
    />
  );
}
