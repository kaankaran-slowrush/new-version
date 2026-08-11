import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   StatusMark — state as a SHAPE, with color as reinforcement.
   =============================================================================

   THE RULE THIS COMPONENT EXISTS TO ENFORCE: status is never color-only.

   A green dot and a red dot are the same dot. That fails for the ~8% of men
   with a red/green deficiency, it fails in greyscale print, it fails in a
   screenshot pasted into a bug report, and it fails for anyone glancing at a
   dashboard from across a desk. So every state here differs in FORM first:

     live     → solid dot + an expanding pulse ring   (the only moving one)
     idle     → hollow ring, nothing filled in         (absence of activity)
     error    → a TRIANGLE                             (not a circle at all)
     success  → filled dot with a check inside

   Read the four with the color stripped out and they are still four different
   marks. Color then makes them faster to read, which is what color is for.

   Server-safe: the pulse is pure CSS (`.anim-ring`, whose reduced-motion gate
   is built into the utility), so there is no state and no directive.

   UX NOTES
   --------
   • Motion is reserved for `live`. If idle also shimmered, "something is
     happening right now" would have no way to announce itself. One moving thing
     per state vocabulary.
   • The pulse ring is `absolute` and `pointer-events-none`, and the mark box
     never grows: a ring that expanded the layout box would nudge every row of a
     table on a 1.8s loop.
   • The accessible label is REQUIRED, not optional. A bare colored dot is
     invisible to a screen reader; `label` renders visibly when `showLabel` is
     set and otherwise lands in `sr-only` text, so the state is always announced.
   • Sizes are `sm` (12px, inline in table rows and pills) and `md` (16px, card
     headers). Below 12px the check and the triangle stop resolving, which would
     put us back to color-only — so there is no `xs`.
   • With `showLabel`, three levels of ink are in play across a typical row: the
     label sits at `ink-secondary` so it supports the value it annotates rather
     than competing with it, while the mark itself carries the semantic color.
   ============================================================================= */

export type StatusMarkStatus = "live" | "idle" | "error" | "success";

const statusMarkVariants = cva(
  ["relative inline-grid shrink-0 place-items-center"],
  {
    variants: {
      size: {
        sm: "size-3",
        md: "size-4",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/* The solid/hollow core. Sized as a fraction of the box so the ring has room. */
const coreVariants = cva(["rounded-full"], {
  variants: {
    status: {
      live: "bg-success",
      idle: "border-2 border-idle bg-transparent",
      error: "bg-transparent",
      success: "bg-success",
    },
    size: {
      sm: "",
      md: "",
    },
  },
  compoundVariants: [
    /* A dot wants to be small; a hollow ring needs more diameter or the 2px
       border swallows the hole; the success disc needs room for the check. */
    { status: "live", size: "sm", class: "size-1.5" },
    { status: "live", size: "md", class: "size-2" },
    { status: "idle", size: "sm", class: "size-2.5" },
    { status: "idle", size: "md", class: "size-3.5" },
    { status: "success", size: "sm", class: "size-3" },
    { status: "success", size: "md", class: "size-4" },
  ],
  defaultVariants: { status: "idle", size: "md" },
});

const glyphVariants = cva([], {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
    },
  },
  defaultVariants: { size: "md" },
});

const checkVariants = cva(["text-accent-text"], {
  variants: {
    size: {
      sm: "size-2",
      md: "size-2.5",
    },
  },
  defaultVariants: { size: "md" },
});

const labelVariants = cva(["truncate text-ink-secondary"], {
  variants: {
    size: {
      sm: "text-2xs",
      md: "text-xs",
    },
  },
  defaultVariants: { size: "md" },
});

export interface StatusMarkProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children">,
    VariantProps<typeof statusMarkVariants> {
  status: StatusMarkStatus;
  /**
   * REQUIRED accessible name — "Running", "Paused", "Failed: rate limited".
   * Rendered visibly when `showLabel` is true, otherwise `sr-only`.
   */
  label: string;
  /** Render `label` next to the mark instead of only announcing it. */
  showLabel?: boolean;
}

export const StatusMark = React.forwardRef<HTMLSpanElement, StatusMarkProps>(
  function StatusMark(
    { className, status, size = "md", label, showLabel = false, ...props },
    ref,
  ) {
    const mark = (
      <span
        className={statusMarkVariants({ size })}
        data-status={status}
        aria-hidden={showLabel ? true : undefined}
      >
        {/* live: the expanding ring. Same color as the core at low alpha, so it
            reads as the dot's own emanation rather than a second object. */}
        {status === "live" ? (
          <span
            className={cn(
              "anim-ring pointer-events-none absolute rounded-full bg-success/40",
              size === "sm" ? "size-1.5" : "size-2",
            )}
          />
        ) : null}

        {status === "error" ? (
          /* Not a dot. The silhouette alone says "problem". */
          <TriangleAlert
            className={cn(glyphVariants({ size }), "text-danger")}
            strokeWidth={2.25}
            aria-hidden
          />
        ) : (
          <span className={cn(coreVariants({ status, size }), "grid place-items-center")}>
            {status === "success" ? (
              <Check
                className={checkVariants({ size })}
                strokeWidth={3.5}
                aria-hidden
              />
            ) : null}
          </span>
        )}
      </span>
    );

    if (!showLabel) {
      return (
        <span
          ref={ref}
          role="img"
          aria-label={label}
          className={cn("inline-flex", className)}
          {...props}
        >
          {mark}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn("inline-flex min-w-0 items-center gap-1.5", className)}
        {...props}
      >
        {mark}
        <span className={labelVariants({ size })}>{label}</span>
      </span>
    );
  },
);

export { statusMarkVariants };
