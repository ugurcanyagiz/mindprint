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
    <section className="w-full" aria-labelledby="assessment-task-title">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {eyebrow}
      </p>
      <h1
        id="assessment-task-title"
        className="mt-4 max-w-[650px] text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-[38px]"
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}

      <div className="mt-8 sm:mt-9">{children}</div>
    </section>
  );
}
