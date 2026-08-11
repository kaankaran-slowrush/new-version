import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { seriesExtent } from "@/lib/series";

/* =============================================================================
   Sparkline — shape over time, in the space of a word
   =============================================================================

   WHY IT EARNS A PLACE. `StatTile`'s delta arrow can say "down 12%". It cannot say
   "down, after three days at zero" — and those two facts lead to completely
   different actions. Shape over time is the one thing no existing component in
   this kit can carry, which is the whole test for adding one.

   THE CONTRACT, and it is absolute: NEVER A SPARKLINE WITHOUT ITS NUMBER.
   These marks have no axes, no ticks, no gridlines and no tooltips. They are
   readable for *shape, direction and gaps* — never for value. The magnitude comes
   from the figure the caller renders next to it. A sparkline on its own is a
   picture of a trend with the units filed off.

   WHY `preserveAspectRatio="none"` — AND THE THREE THINGS IT BREAKS
   Non-uniform scaling is what lets this fill any container width without measuring
   it, which is what keeps it a server component with no ResizeObserver. The cost is
   that everything with a radius distorts, so:
     • every stroked element carries `vectorEffect="non-scaling-stroke"`, or the
       1.5px line gets stretched into a wedge;
     • bars use `rx={0}` — a radius under horizontal stretch becomes a lopsided
       ellipse. Square ends also usefully distinguish this from the capsule-shaped
       audio waveform in session-canvas, which is a transport control, not data;
     • the last-point marker CANNOT be an SVG `<circle>` (it would render as an
       ellipse), so it is an absolutely-positioned sibling `<span>` on the wrapper.
       That is why the root element is a div and not the svg.

   THE DEGENERATE CASES ARE SPECIFIED, NOT LEFT TO CHANCE
     • all zeros    → baseline only, tone forced to muted. NOT a flat line at
       mid-height, which would read as "steady" — the opposite of the truth.
     • fewer than 2 points → baseline only, same box height so the row does not
       jump. A two-point sparkline is the most confident-looking lie available.
     • max === min, non-zero → a genuinely flat line. Flat *is* the shape.

   MINIMUM POINTS (documented, not enforced — see /docs/patterns/visualization):
   7 for `line`/`area`, 5 for `bars`. Below that, use StatTile's delta instead.
   And every sparkline in a column must cover the SAME window, or the column lies
   by juxtaposition — no component-level guard can catch that one.
   ============================================================================= */

const sparklineVariants = cva(["relative w-full"], {
  variants: {
    /* Height only. Width is always 100% of the container. */
    size: {
      xs: "h-4",
      sm: "h-6",
      md: "h-10",
    },
    tone: {
      accent: "text-accent",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      /* For a dead series. Not a judgement — an absence. */
      muted: "text-ink-tertiary",
    },
  },
  defaultVariants: { size: "sm", tone: "accent" },
});

const HEIGHT_PX = { xs: 16, sm: 24, md: 40 } as const;

export interface SparklineProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof sparklineVariants> {
  /** Ordered oldest → newest. RAW quantities, not percentages. */
  values: readonly number[];
  /** `bars` for counts per period; `line`/`area` for a continuous measure. */
  shape?: "line" | "area" | "bars";
  /**
   * Where the vertical axis starts. Defaults to `zero` for bars and `extent` for
   * line/area, and that default is load-bearing: a bar sits on a baseline, so a
   * truncated bar is a lie in a way a floating line is not. `extent` exaggerates
   * by construction — which is what makes shape legible, and exactly why the
   * adjacent number is mandatory.
   */
  scale?: "zero" | "extent";
  /** Marks the most recent point. Defaults on for line/area, off for bars. */
  showLast?: boolean;
  /** REQUIRED. A summary sentence — use `describeSeries()`, never an enumeration. */
  "aria-label": string;
}

export const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  function Sparkline(
    {
      className,
      values,
      shape = "line",
      size = "sm",
      tone,
      scale,
      showLast,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    const clean = values.filter((v) => Number.isFinite(v));
    const e = seriesExtent(clean);
    const H = HEIGHT_PX[size ?? "sm"];
    const isBars = shape === "bars";
    const axis = scale ?? (isBars ? "zero" : "extent");
    const markLast = showLast ?? !isBars;

    /* Dead or too-short series: baseline only, and the tone drops to muted so it
       does not imply a judgement about data that is not there. */
    const dead = e.count < 2 || e.max === 0;
    const effectiveTone = dead ? "muted" : tone;

    const stroke = 1.5;
    const pad = stroke / 2;
    const yTop = pad;
    const yBot = H - pad;
    const lo = axis === "zero" ? 0 : e.min;
    const span = e.max - lo || 1;

    const xAt = (i: number) => (e.count < 2 ? 0 : (i / (e.count - 1)) * 100);
    const yAt = (v: number) => yBot - ((v - lo) / span) * (yBot - yTop);

    const points = clean.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
    const lastX = e.count < 2 ? 0 : 100;
    const lastY = e.count < 2 ? yBot : yAt(e.last);

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel}
        className={cn(sparklineVariants({ size, tone: effectiveTone }), className)}
        {...props}
      >
        <svg
          aria-hidden
          viewBox={`0 0 100 ${H}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {dead ? (
            /* The honest empty state: a track, at the baseline, and nothing else. */
            <line
              x1="0"
              y1={yBot}
              x2="100"
              y2={yBot}
              stroke="var(--color-line-inner)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ) : isBars ? (
            <>
              {/* The baseline is MANDATORY for bars. Bars encode length FROM a
                  baseline, so an invisible one makes truncation invisible too. */}
              <line
                x1="0"
                y1={yBot}
                x2="100"
                y2={yBot}
                stroke="var(--color-line-inner)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              {clean.map((v, i) => {
                const pitch = 100 / e.count;
                const w = pitch * 0.68;
                const y = yAt(v);
                return (
                  <rect
                    key={i}
                    x={i * pitch + (pitch - w) / 2}
                    y={y}
                    width={w}
                    height={Math.max(0, yBot - y)}
                    rx={0}
                    fill="currentColor"
                  />
                );
              })}
            </>
          ) : (
            <>
              {shape === "area" ? (
                <polygon
                  points={`0,${yBot} ${points} 100,${yBot}`}
                  fill="currentColor"
                  opacity={0.14}
                />
              ) : null}
              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        {/* The last-point marker lives OUTSIDE the svg — see the header note on
            preserveAspectRatio. Percentages cannot be Tailwind classes, so the
            position is an inline style, same precedent as MeterBar's fill width. */}
        {markLast && !dead ? (
          <span
            aria-hidden
            className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
            style={{ left: `${lastX}%`, top: `${(lastY / H) * 100}%` }}
          />
        ) : null}
      </div>
    );
  },
);

export { sparklineVariants };
