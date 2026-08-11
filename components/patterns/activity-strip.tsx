import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { seriesExtent } from "@/lib/series";

/* =============================================================================
   ActivityStrip — when things happened, and where the gaps are
   =============================================================================

   WHY IT EARNS A PLACE. "When did runs happen, and where are the holes" is
   unanswerable by any number, any meter, and — at 30 points — by a sparkline too:
   a 30-bar sparkline turns a four-day outage into a smudge. A density strip makes
   the gap the most visible thing in the graphic, which is correct, because the gap
   is the thing worth acting on.

   CSS, NOT SVG. A flex row of fixed-size cells is simpler than 30 rects, wraps
   nothing, and lets the overflow boundary live inside the component.

   ORDERED LIGHTNESS, NOT CATEGORICAL HUE. Four steps of one accent, keyed to
   quartiles. Ordered lightness is greyscale-safe by construction, which is why this
   component takes no semantic `tone` — a density is a quantity, never a judgement,
   and painting a busy day amber would invent a policy the component has no business
   holding.

   ZERO DIFFERS IN FORM, NOT LIGHTNESS. An empty day is a hollow outlined cell, not
   the palest fill. This is the StatusMark doctrine applied to a chart: **an absence
   of activity is not a small amount of activity**, and the palest fill would say it
   was. (`box-sizing: border-box` is global, so the border does not change the cell
   size.)

   TWO AXIS LABELS ARE PERMITTED AND REQUIRED. The first and last date, at the two
   ends. A density strip with no start and end is undecodable, and pretending
   otherwise would be a worse violation than printing two dates.

   NO `title` ON CELLS. A native tooltip across 30 cells is a hover lottery, and it
   would license reading values off an axis-free mark. The `summary` prop carries
   what a hover would have said, visibly, for everyone.
   ============================================================================= */

const cellVariants = cva(["shrink-0 rounded-[3px]"], {
  variants: {
    size: { sm: "size-2", md: "size-2.5" },
    /* Literal class strings, indexed — never `bg-accent/${n}`. Tailwind's scanner
       cannot see a constructed class name; this is the same constraint that forced
       icon sizes into cva variants across the kit. */
    level: {
      0: "border border-line-strong bg-transparent",
      1: "bg-accent/25",
      2: "bg-accent/45",
      3: "bg-accent/70",
      4: "bg-accent",
    },
  },
  defaultVariants: { size: "md", level: 0 },
});

export interface ActivityDay {
  /** Human date, e.g. "22 Jul". Used for the endpoint labels. */
  label: string;
  value: number;
}

export interface ActivityStripProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    Pick<VariantProps<typeof cellVariants>, "size"> {
  days: readonly ActivityDay[];
  /** Printed under the strip. REQUIRED — it is the text fallback for everyone. */
  summary: React.ReactNode;
  showLegend?: boolean;
  /** REQUIRED. A summary sentence, never an enumeration of 30 days. */
  "aria-label": string;
}

export const ActivityStrip = React.forwardRef<HTMLDivElement, ActivityStripProps>(
  function ActivityStrip(
    { className, days, size = "md", summary, showLegend = true, "aria-label": ariaLabel, ...props },
    ref,
  ) {
    const e = seriesExtent(days.map((d) => d.value));

    /* Quartiles of the window max. Level 0 is reserved for exactly zero, so the
       four filled steps divide only the non-zero range — otherwise a window whose
       busiest day is 4 runs would put "1 run" and "no runs" in the same bucket. */
    const level = (v: number): 0 | 1 | 2 | 3 | 4 => {
      if (v <= 0) return 0;
      if (e.max <= 0) return 0;
      const q = v / e.max;
      if (q <= 0.25) return 1;
      if (q <= 0.5) return 2;
      if (q <= 0.75) return 3;
      return 4;
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div role="img" aria-label={ariaLabel}>
          {/* The overflow boundary lives HERE, not on the page. 30 cells fit; 90
              would not, and the component owning its own scroll is the kit's rule
              for wide content. */}
          <div className="flex gap-1 overflow-x-auto overscroll-x-contain pb-1">
            {days.map((d, i) => (
              <span key={i} aria-hidden className={cellVariants({ size, level: level(d.value) })} />
            ))}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-4">
          <span className="tabular font-mono text-2xs text-ink-tertiary">
            {days[0]?.label}
          </span>

          {showLegend ? (
            <span className="flex items-center gap-1.5">
              <span className="text-2xs text-ink-tertiary">less</span>
              {([0, 1, 2, 3, 4] as const).map((l) => (
                <span key={l} aria-hidden className={cellVariants({ size: "sm", level: l })} />
              ))}
              <span className="text-2xs text-ink-tertiary">more</span>
            </span>
          ) : null}

          <span className="tabular font-mono text-2xs text-ink-tertiary">
            {days[days.length - 1]?.label}
          </span>
        </div>

        {/* What a tooltip would have said, said out loud instead. */}
        <p className="mt-2 text-xs text-ink-secondary">{summary}</p>
      </div>
    );
  },
);

export { cellVariants as activityCellVariants };
