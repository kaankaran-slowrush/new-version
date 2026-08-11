import * as React from "react";
import { cn } from "@/lib/cn";
import { MeterBar } from "./meter-bar";

/* =============================================================================
   BarList — ranked comparison against ONE declared denominator
   =============================================================================

   THE RULING THIS RESOLVES

   /docs/patterns/status already says, about MeterBar:

     "And do not stack meters to compare series. Four bars in a column is a glance
      at four unrelated proportions; it is not a chart, and it will be misread as
      one the moment the labels get long."

   That ban is correct and it stays. But read what it is actually about. Four
   stacked meters are wrong because each bar has its OWN, UNDECLARED denominator
   while sitting in a column that invites length comparison. The problem was never
   the mark. It was the missing scale.

   So: **a bar is honest when its denominator is declared.** MeterBar declares one
   implicitly ("this thing's own limit"). This component declares one explicitly, in
   print, once, above the rows — and then renders the rows as literal MeterBars.

   WHICH IS WHY THIS COMPOSES MeterBar RATHER THAN DRAWING A BAR. There is no new
   mark to learn: every row is the same 3px strip the user already reads, with the
   same tokens, the same tone vocabulary and the same `.tabular` readout. That is
   what makes this an extension of the motif instead of a rival to it.

   NOT IN THE API, on purpose: a per-item `href`. A BarList is a readout, not
   navigation. Making rows interactive drags in hover, focus and pressed states and
   turns a presentational list into a control — at which point it wants to be a
   table.
   ============================================================================= */

export interface BarListItem {
  label: React.ReactNode;
  /** RAW quantity. Not a percentage — the component computes the share. */
  value: number;
  /** Pre-formatted readout, e.g. "$212.10". This component never formats numbers. */
  valueLabel: React.ReactNode;
  tone?: "accent" | "success" | "warning" | "danger";
}

export interface BarListProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items: readonly BarListItem[];
  /**
   * REQUIRED, with no default, and that is the point. `total` = bars are shares of
   * the sum and add up to 100%. `max` = bars are relative to the largest row. An
   * undeclared scale is the single most common way a small chart lies, so the
   * author has to say which one they mean.
   */
  scale: "total" | "max";
  /**
   * REQUIRED. Printed once, above the rows. THIS IS THE AXIS — the whole
   * justification for the component. e.g. "share of $355.64 spent this month".
   */
  scaleLabel: React.ReactNode;
  thickness?: "hairline" | "default";
  /** Rows past this roll into one aggregate row, so the list cannot grow a tail. */
  maxRows?: number;
  otherLabel?: string;
}

export const BarList = React.forwardRef<HTMLDivElement, BarListProps>(
  function BarList(
    {
      className,
      items,
      scale,
      scaleLabel,
      thickness = "hairline",
      maxRows,
      otherLabel = "Other",
      ...props
    },
    ref,
  ) {
    const sorted = [...items].sort((a, b) => b.value - a.value);

    let rows: BarListItem[] = sorted;
    if (maxRows && sorted.length > maxRows) {
      const head = sorted.slice(0, maxRows - 1);
      const tail = sorted.slice(maxRows - 1);
      const tailTotal = tail.reduce((a, b) => a + b.value, 0);
      rows = [
        ...head,
        {
          label: `${otherLabel} (${tail.length})`,
          value: tailTotal,
          valueLabel: "",
          tone: "accent",
        },
      ];
    }

    const denominator =
      scale === "total"
        ? items.reduce((a, b) => a + b.value, 0) || 1
        : Math.max(...items.map((i) => i.value), 1);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* The declared scale. `.eyebrow` because this is machine-ish labelling
            about the axis, not a heading. */}
        <p className="eyebrow mb-2.5 text-ink-tertiary">{scaleLabel}</p>

        <ol className="space-y-2.5">
          {rows.map((item, i) => {
            const pct = (item.value / denominator) * 100;
            return (
              <li key={i}>
                <MeterBar
                  value={pct}
                  tone={item.tone ?? "accent"}
                  thickness={thickness}
                  label={item.label}
                  showValue={item.valueLabel || undefined}
                  /* The share is spelled out rather than relying on
                     aria-valuenow, so a screen reader gets the quantity AND the
                     proportion AND what the proportion is of. */
                  aria-label={`${
                    typeof item.label === "string" ? item.label : "Row"
                  }: ${
                    typeof item.valueLabel === "string" ? item.valueLabel : item.value
                  }, ${Math.round(pct)}% of ${
                    typeof scaleLabel === "string" ? scaleLabel : "the total"
                  }`}
                  /* A zero row renders an EMPTY TRACK, label and value intact.
                     Not a 1px stub (a lie about magnitude) and not a dropped row
                     (a lie about existence). Ink drops instead. */
                  className={item.value === 0 ? "opacity-55" : undefined}
                />
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);
