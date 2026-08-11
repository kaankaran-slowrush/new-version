/* =============================================================================
   Documentation building blocks
   =============================================================================
   These exist only inside /docs. They are intentionally plain — the docs site
   should never be the most interesting thing in the repo, and dogfooding the
   product components here would make it unclear whether you are looking at a
   component or at the chrome describing it.
   ============================================================================= */

import { cn } from "@/lib/cn";

/** Page title block for a docs page. */
export function DocHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-12 border-b border-line-inner pb-8">
      {eyebrow && (
        <p className="mb-2 eyebrow text-accent-ink">
          {eyebrow}
        </p>
      )}
      <h1 className="mb-3 text-3xl">{title}</h1>
      {lede && <p className="max-w-measure text-base text-ink-secondary">{lede}</p>}
    </header>
  );
}

/** A titled section within a docs page. */
export function DocSection({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <h2 className="mb-2 text-xl">{title}</h2>
      {description && (
        <p className="mb-6 max-w-measure text-ink-secondary">{description}</p>
      )}
      {children}
    </section>
  );
}

/**
 * The rationale block. This is the part of the docs that actually transfers
 * judgment rather than markup — every component page must carry one.
 */
export function UXNote({
  title = "Why it behaves this way",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="mb-8 rounded-2xl border-l-[3px] border-l-accent bg-accent-soft/40 p-5">
      <p className="mb-2 eyebrow text-accent-ink">
        {title}
      </p>
      <div className="space-y-2 text-sm text-ink-secondary [&_strong]:text-ink [&_strong]:font-semibold">
        {children}
      </div>
    </aside>
  );
}

/** A "do not do this" counterpoint. Pairs with UXNote. */
export function DontNote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="mb-8 rounded-2xl border-l-[3px] border-l-danger bg-danger-soft p-5">
      <p className="mb-2 eyebrow text-danger">
        Avoid
      </p>
      <div className="space-y-2 text-sm text-ink-secondary [&_strong]:text-ink [&_strong]:font-semibold">
        {children}
      </div>
    </aside>
  );
}

/** A framed live specimen. `stack` lays children out vertically. */
export function Example({
  label,
  children,
  className,
  stack = false,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  stack?: boolean;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-surface shadow-sm">
      {label && (
        <div className="border-b border-line-inner px-5 py-2.5">
          <span className="eyebrow text-ink-tertiary">
            {label}
          </span>
        </div>
      )}
      <div
        className={cn(
          "flex flex-wrap items-center gap-4 p-6",
          stack && "flex-col items-start",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Measurement / spec table. The thing a dev on a different stack actually needs. */
export function SpecTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (React.ReactNode | string)[][];
}) {
  return (
    <div className="mb-8 overflow-x-auto rounded-2xl bg-surface shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="border-b border-line-inner px-5 py-3 eyebrow text-ink-tertiary"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-5 py-3 align-top text-sm",
                    i > 0 && "border-t border-line-inner",
                    j === 0 ? "font-mono text-ink" : "text-ink-secondary",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline code. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-xs bg-surface-sunken px-1.5 py-0.5 font-mono text-code text-ink">
      {children}
    </code>
  );
}

/** A color swatch with its token name and resolved value. */
export function Swatch({
  token,
  name,
  note,
}: {
  token: string;
  name: string;
  note?: string;
}) {
  return (
    <div className="w-full max-w-[9rem]">
      <div
        className="mb-2 h-16 rounded-lg shadow-xs"
        style={{ backgroundColor: `var(${token})` }}
      />
      <p className="font-mono text-2xs text-ink">{name}</p>
      {note && <p className="mt-0.5 text-2xs text-ink-tertiary">{note}</p>}
    </div>
  );
}
