import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { MeterBar, type MeterBarProps } from "./meter-bar";

/* =============================================================================
   StatTile — one metric, read in one glance.
   =============================================================================

   Structure, top to bottom: eyebrow → value → delta → optional meter.

   UX NOTES
   --------
   • HIERARCHY IS SIZE **AND** WEIGHT **AND** COLOR, never size alone. Scaling
     one number up while everything stays the same grey gives you a big grey
     page. Here: the eyebrow is 11px uppercase SANS at `ink-tertiary` (small,
     tracked, recessive — it is a field name you read once), the value is
     `text-2xl` semibold at `ink` (the answer), the delta is 12px medium in a
     semantic color, the caption drops to `ink-muted`. Four levels of ink, so
     the eye lands on the number without being told to.
   • The eyebrow is MONO and letter-spaced. Uppercase at 11px loses its word
     shapes, and tracking is what buys the legibility back; the case change
     makes it read as a machine label rather than shouted prose.
   • The value carries `.tabular`. A metric that ticks 1,299 → 1,300 must not
     re-measure itself and shove the delta sideways.
   • DELTA DIRECTION IS AN ARROW, not just a color and a sign. Same reason as
     StatusMark: green/red alone is not a signal everyone receives. `inverted`
     exists because "up" is not always good — latency, error rate, spend.
   • The optional MeterBar is the same 3px motif used on fleet cards and
     generation progress. Reusing it here is the point: the user has already
     learned to read it.
   • Never put a border between a tile's own label and value. Whitespace groups;
     a line separates. A line there says they are two different things.
   ============================================================================= */

const statTileVariants = cva(["min-w-0"], {
  variants: {
    /* `plain` for tiles already inside a Card or a bordered grid cell;
       `panel` when the tile IS the card. Concentric: a tile nested in a
       `rounded-2xl` card steps down to `rounded-xl`. */
    surface: {
      plain: "",
      panel: "rounded-xl bg-surface p-4 shadow-xs",
      sunken: "rounded-xl bg-surface-sunken p-4",
    },
    align: {
      start: "text-left",
      end: "text-right",
    },
  },
  defaultVariants: { surface: "plain", align: "start" },
});

const valueVariants = cva(["tabular text-ink"], {
  variants: {
    size: {
      /* Dense grids of six or more tiles. */
      sm: "text-lg font-semibold",
      md: "text-2xl font-semibold",
      /* A single hero number — a balance, a total spend. */
      lg: "text-3xl font-semibold",
    },
  },
  defaultVariants: { size: "md" },
});

const deltaVariants = cva(
  ["tabular inline-flex items-center gap-1 text-xs font-medium"],
  {
    variants: {
      tone: {
        positive: "text-success",
        negative: "text-danger",
        neutral: "text-ink-tertiary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface StatTileProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof statTileVariants>,
    VariantProps<typeof valueVariants> {
  /** Uppercase tracked field name. Keep it to two or three words. */
  label: React.ReactNode;
  /** The metric itself. Pre-formatted — this component does not format numbers. */
  value: React.ReactNode;
  /** Small trailing unit at `ink-tertiary`, e.g. "req/s", "GB", "USD". */
  unit?: React.ReactNode;
  /** Change readout, e.g. "12.4%" or "+310". Pair with `deltaDirection`. */
  delta?: React.ReactNode;
  /** Arrow + color. `flat` renders a dash and stays neutral. */
  deltaDirection?: "up" | "down" | "flat";
  /**
   * Flips which direction counts as good. Use for metrics where up is bad —
   * latency, error rate, cost.
   */
  invertDelta?: boolean;
  /** Lowest-priority meta under the delta: "vs. last 7d", "since Jun 1". */
  caption?: React.ReactNode;
  /**
   * Renders the shared MeterBar beneath the value. Pass the MeterBar props you
   * want (`value`, `tone`, `thickness`, `label`, `showValue`).
   */
  meter?: MeterBarProps;
  /** Top-right slot — a StatusMark, an icon, a small menu button. */
  adornment?: React.ReactNode;
}

export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  function StatTile(
    {
      className,
      surface,
      align,
      size,
      label,
      value,
      unit,
      delta,
      deltaDirection = "flat",
      invertDelta = false,
      caption,
      meter,
      adornment,
      ...props
    },
    ref,
  ) {
    const tone =
      deltaDirection === "flat"
        ? "neutral"
        : (deltaDirection === "up") !== invertDelta
          ? "positive"
          : "negative";

    const DeltaIcon =
      deltaDirection === "up"
        ? ArrowUp
        : deltaDirection === "down"
          ? ArrowDown
          : Minus;

    return (
      <div
        ref={ref}
        className={cn(statTileVariants({ surface, align }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow text-ink-tertiary">
            {label}
          </span>
          {adornment ? (
            <span className="-mt-0.5 shrink-0">{adornment}</span>
          ) : null}
        </div>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className={valueVariants({ size })}>{value}</span>
          {unit ? (
            <span className="text-sm text-ink-tertiary">{unit}</span>
          ) : null}
        </div>

        {delta || caption ? (
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {delta ? (
              <span className={deltaVariants({ tone })}>
                <DeltaIcon className="size-3" strokeWidth={2.5} aria-hidden />
                {/* The arrow is the visual carrier; this is the same
                    information for anyone who cannot see it. */}
                <span className="sr-only">
                  {deltaDirection === "up"
                    ? "Up "
                    : deltaDirection === "down"
                      ? "Down "
                      : "No change "}
                </span>
                {delta}
              </span>
            ) : null}
            {caption ? (
              <span className="text-2xs text-ink-tertiary">{caption}</span>
            ) : null}
          </div>
        ) : null}

        {meter ? <MeterBar {...meter} className={cn("mt-3", meter.className)} /> : null}
      </div>
    );
  },
);

export { statTileVariants, valueVariants as statValueVariants };
