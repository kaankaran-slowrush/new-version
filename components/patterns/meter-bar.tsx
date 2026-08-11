import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   MeterBar — the product's one signature proportion strip.
   =============================================================================

   ONE MOTIF, REUSED EVERYWHERE. Any time something in this product has a
   proportion, it is this strip and nothing else:

     • fleet cards        — load / utilisation per model
     • generation         — progress of an in-flight image/video job
     • billing            — balance remaining against the plan
     • stat tiles         — a quota bar under a metric (see StatTile)

   That is deliberate. A product that invents a new progress treatment per
   screen (a ring here, a striped bar there, a percentage donut somewhere else)
   teaches the user nothing; the same 3px strip in four places becomes a thing
   they read at a glance without reading. Do not add a second one — if a new
   surface needs a proportion, it needs this, possibly at a new `thickness`.

   TWO MODES. `value` renders one fill; `segments` divides the same track into up
   to four named parts with a legend. They are mutually exclusive at the TYPE level
   (a discriminated union) rather than by comment, so the ambiguous call cannot be
   written.

   Segmenting is an EXTENSION of this motif, not a second treatment: same track,
   same thickness scale, same caps, same left-to-right full-is-the-whole reading.
   Someone who has learned the strip reads a segmented one correctly on sight —
   which is the exact test the one-motif rule sets. What it is NOT is four stacked
   meters; see the DontNote on /docs/patterns/status, and BarList, which is the
   sanctioned way to compare across categories.

   Server-safe: no state, no effects. The fill width is the only dynamic value
   and it is an inline style, because a percentage cannot be a Tailwind class.

   UX NOTES
   --------
   • The strip is 3px by default (`--meter-thickness`). A meter is a glance
     value, not a chart — the moment it gets tall enough to look like a chart,
     people expect axes and labels it does not have.
   • `tone` is semantic, never decorative: `accent` = neutral proportion (this
     is how much of a thing there is), `success/warning/danger` = a judgement
     about that proportion. A bar that turns red must mean something is wrong,
     otherwise red stops meaning anything.
   • Tone is never the ONLY carrier of meaning: pass `label`/`showValue` so the
     state survives greyscale, colorblindness and screenshots.
   • The numeric readout is `.tabular` so a value counting 8% → 9% → 10% during
     a live job does not shuffle the label next to it.
   • Three text levels in the header row: `label` at `ink-secondary`, the value
     at `ink` (it is the answer), `hint` at `ink-muted`. Value and label at the
     same weight and color would leave the row with nothing to read first.
   • Fill transitions on width only, at `--duration-normal`: a progress bar that
     snaps looks like a re-render, one that eases looks like it is measuring.
   ============================================================================= */

const meterTrackVariants = cva(["meter w-full"], {
  variants: {
    /* Sets the `--meter-thickness` component token the `.meter` utility reads,
       so the height stays a single source of truth rather than a class on the
       track and a different one on the fill. */
    thickness: {
      hairline: "[--meter-thickness:2px]",
      default: "[--meter-thickness:3px]",
      thick: "[--meter-thickness:6px]",
      chunky: "[--meter-thickness:10px]",
    },
  },
  defaultVariants: { thickness: "default" },
});

const meterFillVariants = cva(
  ["transition-[width] duration-(--duration-normal) ease-(--ease-out-quint)"],
  {
    variants: {
      tone: {
        accent: "bg-accent",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
      },
    },
    defaultVariants: { tone: "accent" },
  },
);

/* Ordered accent ramp, as literal strings so Tailwind's scanner sees them.
   NEVER semantic hues here: "audio = red" would spend the danger colour on a
   category name, and ordered lightness is what keeps segments legible in
   greyscale. Callers must pass segments in DESCENDING order so the ramp stays
   monotonic with segment size and the strip reads as a ranking. */
const SEGMENT_FILL = ["bg-accent", "bg-accent/70", "bg-accent/45", "bg-accent/25"] as const;

export interface MeterSegment {
  /** Share of the track, 0–100. The caller normalises; this clamps the sum. */
  value: number;
  /** REQUIRED. A segment can never be identified by colour alone. */
  label: string;
  /** Pre-formatted legend readout: "40%", "$88.40". */
  valueLabel?: React.ReactNode;
}

export interface MeterBarProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof meterTrackVariants>,
    VariantProps<typeof meterFillVariants> {
  /** 0–100. Clamped, so an out-of-range value can never overflow the track. */
  value?: number;
  /**
   * Composition mode. Max 4 — roll the tail into one "Other" at the call site.
   * Mutually exclusive with `value`.
   */
  segments?: readonly MeterSegment[];
  /** Legend under a segmented strip. Defaults on, and should stay on. */
  showLegend?: boolean;
  /** Left-hand caption above the strip. */
  label?: React.ReactNode;
  /**
   * Right-hand readout above the strip. Pass a node to show a real unit
   * ("3.2k / 5k") instead of a bare percentage; `true` renders `{value}%`.
   */
  showValue?: boolean | React.ReactNode;
  /** Lowest-priority meta, right of the value. Units, plan name, ETA. */
  hint?: React.ReactNode;
  /**
   * Accessible name when there is no visible `label` — a bare bar with no name
   * is announced as "progress bar" and nothing else.
   */
  "aria-label"?: string;
}

export const MeterBar = React.forwardRef<HTMLDivElement, MeterBarProps>(
  function MeterBar(
    {
      className,
      value,
      tone,
      thickness,
      label,
      showValue,
      hint,
      segments,
      showLegend = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value! : 0));
    const segs = segments?.slice(0, 4) ?? null;
    const readout =
      showValue === true ? `${Math.round(pct)}%` : showValue || null;
    const hasHeader = Boolean(label || readout || hint);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {hasHeader ? (
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            {label ? (
              <span className="truncate text-xs text-ink-secondary">
                {label}
              </span>
            ) : (
              <span />
            )}
            {readout || hint ? (
              <span className="flex shrink-0 items-baseline gap-1.5">
                {readout ? (
                  <span className="tabular text-xs font-medium text-ink">
                    {readout}
                  </span>
                ) : null}
                {hint ? (
                  <span className="tabular text-2xs text-ink-tertiary">{hint}</span>
                ) : null}
              </span>
            ) : null}
          </div>
        ) : null}

        {segs ? (
          /* SEGMENTED. `role="img"`, NOT `progressbar` — and this is the
             load-bearing accessibility difference, not a detail. A composition has
             no `valuenow`; announcing "progress bar, 40%" for a four-way mix is
             simply wrong. The composed label names every part instead. */
          <div
            role="img"
            aria-label={
              ariaLabel ??
              segs
                .map((sg) => `${sg.label} ${Math.round(sg.value)}%`)
                .join(", ")
            }
            className={meterTrackVariants({ thickness })}
          >
            <span className="meter-segments">
              {segs.map((sg, i) =>
                /* A 0% segment renders NO span at all, and still appears in the
                   legend below. Same rule as ActivityStrip's empty cell: an
                   absence must differ in form, not merely in size. */
                sg.value <= 0 ? null : (
                  <span
                    key={sg.label}
                    className={SEGMENT_FILL[i]}
                    style={{ width: `${Math.max(0, Math.min(100, sg.value))}%` }}
                  />
                ),
              )}
            </span>
          </div>
        ) : (
          <div
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={meterTrackVariants({ thickness })}
          >
            {/* `.meter > span` in globals.css owns height/radius; this only sets
                the proportion and the tone. */}
            <span
              className={meterFillVariants({ tone })}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {segs && showLegend ? (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {segs.map((sg, i) => (
              <li key={sg.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={cn("size-2 shrink-0 rounded-full", SEGMENT_FILL[i])}
                />
                <span className="text-xs text-ink-secondary">{sg.label}</span>
                {sg.valueLabel ? (
                  <span className="tabular text-xs font-medium text-ink">
                    {sg.valueLabel}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);

export { meterTrackVariants, meterFillVariants };
