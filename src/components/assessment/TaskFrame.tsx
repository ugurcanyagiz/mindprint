import type { PropsWithChildren } from "react";

type TaskFrameProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description?: string;
}>;

export function TaskFrame({
  eyebrow,
  title,
  description,
  children,
}: TaskFrameProps) {
  return (
    <section
      className="w-full"
      aria-labelledby="assessment-task-title"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {eyebrow}
      </p>
      <h1
        id="assessment-task-title"
        className="mt-4 max-w-[680px] text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-[40px]"
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-[650px] text-[16px] leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}

      <div className="mt-10">{children}</div>
    </section>
  );
}
