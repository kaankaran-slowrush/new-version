"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   FilterPills — one row of capsules, exactly one active.
   =============================================================================

   Controlled and stateless: `value` in, `onValueChange` out. No internal state,
   no filtering — the caller owns which items exist and what selecting one does.

   `"use client"` because this is the one pattern in this folder that renders its
   own interactive elements and binds its own click handlers; the rest are
   presentational and stay server-safe.

   UX NOTES
   --------
   • EXACTLY ONE ACTIVE, ALWAYS. This is a single-select ("All / Running /
     Failed"), so there is no zero state — "All" is the neutral option, not an
     absence. If you need multi-select, these are the wrong control: multi-select
     needs checkboxes or removable chips, because a pill row gives the user no way
     to see that two independent filters are stacked.
   • THE ACTIVE PILL IS DARKER AND HEAVIER, not just tinted. Weight plus color,
     because a tint alone at these sizes is easy to miss and disappears in
     greyscale. `rounded-full` for every pill: a capsule already reads as
     "toggleable tag" without any extra affordance.
   • `role="radiogroup"` with `aria-checked` — semantically this IS a radio group,
     and using buttons with `aria-pressed` would announce four independent toggles
     instead of one choice with four options.
   • THE ROW SCROLLS, THE PAGE DOES NOT. Twelve model filters on a narrow viewport
     must scroll inside this strip rather than widen the page. `overscroll-x-contain`
     keeps a horizontal swipe from turning into browser back-navigation.
   • COUNTS ARE A SECOND INK LEVEL INSIDE THE PILL. The label is the thing you
     read, the count is context — same size, weaker ink (`ink-muted` at rest,
     inherited-with-opacity when active so it stays legible on the dark fill).
     Same-color counts would make each pill read as two equal words.
   • The `segmented` variant is the one sanctioned use of the neumorphic
     utilities: a `.neu-inset` well with a `.neu-raised` thumb, where pressed vs.
     unpressed physicality IS the information. Labels sit on the raised opaque
     surface, never on the well itself — see globals.css.
   ============================================================================= */

const filterPillsVariants = cva(
  [
    "flex min-w-0 items-center overflow-x-auto overscroll-x-contain",
    /* Keeps the first/last pill from being clipped mid-capsule while scrolling. */
    "scroll-px-1 py-0.5",
  ],
  {
    variants: {
      variant: {
        /* Free-standing pills on the canvas. */
        solid: "gap-1.5",
        /* One well containing the set — reads as a single control. */
        segmented: "neu-inset gap-1 rounded-full p-1",
      },
      size: {
        sm: "",
        md: "",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

const pillVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,box-shadow,transform]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-ink-muted",
  ],
  {
    variants: {
      variant: {
        solid: "",
        segmented: "",
      },
      size: {
        /* One notch below a button, deliberately — a pill is a filter, not an
           action, and it should not compete with the button beside it. It moves
           WITH the control ladder rather than staying put: at 32 against a 40px
           button it stopped reading as "one notch below" and started reading as
           an afterthought. */
        sm: "h-8 px-3 text-2xs",
        md: "h-9 px-3.5 text-sm",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        active: false,
        /* `raised-hover` for the same reason the secondary Button uses it: this
           pill paints the card tier at rest, so its hover has to be a step above
           that rather than the token meant for transparent-at-rest things. */
        class: "bg-surface text-ink-secondary shadow-xs hover:bg-surface-raised-hover hover:text-ink",
      },
      {
        variant: "solid",
        active: true,
        class: "bg-accent text-accent-text shadow-xs",
      },
      {
        variant: "segmented",
        active: false,
        class: "bg-transparent text-ink-tertiary hover:text-ink",
      },
      {
        variant: "segmented",
        active: true,
        class: "neu-raised text-ink",
      },
    ],
    defaultVariants: { variant: "solid", size: "md", active: false },
  },
);

export interface FilterPillItem {
  value: string;
  label: React.ReactNode;
  /** Optional trailing count. Rendered `.tabular` so it cannot shift the pill. */
  count?: number | string;
  disabled?: boolean;
}

export interface FilterPillsProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onChange">,
    VariantProps<typeof filterPillsVariants> {
  items: FilterPillItem[];
  /** The single active value. Controlled — there is no uncontrolled mode. */
  value: string;
  onValueChange?: (value: string) => void;
  /** Accessible name for the group: "Filter runs by status". */
  "aria-label"?: string;
}

export const FilterPills = React.forwardRef<HTMLDivElement, FilterPillsProps>(
  function FilterPills(
    {
      className,
      variant = "solid",
      size = "md",
      items,
      value,
      onValueChange,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(filterPillsVariants({ variant, size }), className)}
        {...props}
      >
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={item.disabled}
              onClick={() => onValueChange?.(item.value)}
              className={pillVariants({ variant, size, active })}
            >
              {item.label}
              {item.count !== undefined ? (
                <span
                  className={cn(
                    "tabular",
                    active ? "opacity-70" : "text-ink-tertiary",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  },
);

export { filterPillsVariants, pillVariants as filterPillVariants };
