import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Toolbar — a horizontal action bar with a left and a right slot.
   =============================================================================

   Two slots, because a toolbar only ever answers two questions: "what am I
   looking at / narrowing down" (left) and "what can I do about it" (right).

     <Toolbar
       left={<><FilterPills … /><ToolbarSeparator /><span>24 results</span></>}
       right={<><Button variant="ghost">Export</Button><Button variant="primary">New</Button></>}
     />

   Server-safe — it is a layout, not a control. The things inside it are controls.

   UX NOTES
   --------
   • LEFT IS CONTEXT, RIGHT IS ACTION. Consistently. Once the primary button is
     bottom-right on one screen and top-left on another, the user has to search
     for it every time instead of moving the pointer where it always is.
   • SEPARATORS ARE FOR GROUPS THAT MEAN DIFFERENT THINGS, not for every gap.
     Spacing already groups; a rule between two related buttons says they are
     unrelated. Rule of thumb: if you cannot name the two groups a separator
     divides, delete it and widen the gap instead.
   • THE SEPARATOR IS A SHORT INSET HAIRLINE (`h-5`), never full-height. A rule
     running the whole bar height reads as a table border and cuts the bar into
     cells; an inset one reads as a pause.
   • THE BAR SCROLLS, THE PAGE DOES NOT. `overflow-x-auto` with the right slot
     `shrink-0`: when space runs short, the context side compresses and scrolls
     while the actions stay reachable. The reverse — actions sliding off-screen —
     leaves the user with a bar they cannot use.
   • `wrap` is the alternative for content-heavy bars: prefer wrapping to
     scrolling when the left slot holds filter pills that must all stay visible.
   • `sticky` keeps a bulk-action bar in view while a long list scrolls under it.
     Pair it with `surface` or `sunken` — a transparent sticky bar lets rows
     scroll through the text behind it.
   ============================================================================= */

const toolbarVariants = cva(
  ["flex w-full items-center justify-between gap-3"],
  {
    variants: {
      surface: {
        /* Sits directly on the page or inside a card's padding. */
        plain: "",
        /* Its own object. Concentric: one rung inside a Card's `2xl`. */
        surface: "panel-edge surface-veil rounded-xl bg-surface px-3 py-2 shadow-sm",
        /* Recessed strip — for a bar between a header and a table. */
        sunken: "rounded-xl bg-surface-sunken px-3 py-2",
        /* Just a rule under the bar. */
        divided: "border-b border-line-inner pb-3",
      },
      /* The floor is the CONTROL height, not a number of its own. These were
         min-h-8/9/11 — 32/36/44, the control ladder written out by hand — so the
         first time that ladder moved, every toolbar in the product would have been
         shorter than the buttons inside it. */
      size: {
        sm: "min-h-(--control-height-sm)",
        md: "min-h-(--control-height-md)",
        lg: "min-h-(--control-height-lg)",
      },
      /* Compress-and-scroll (default) vs. reflow. See UX NOTES. */
      wrap: {
        true: "flex-wrap",
        false: "overflow-x-auto overscroll-x-contain",
      },
      sticky: {
        true: "sticky top-0 z-(--z-sticky)",
      },
    },
    defaultVariants: { surface: "plain", size: "md", wrap: false },
  },
);

export interface ToolbarProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof toolbarVariants> {
  /** Context: filters, search, result counts, view switchers. */
  left?: React.ReactNode;
  /** Actions. Stays fully visible when space is tight. */
  right?: React.ReactNode;
  /** Accessible name — "Run list actions". */
  "aria-label"?: string;
}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  function Toolbar(
    { className, surface, size, wrap, sticky, left, right, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(
          toolbarVariants({ surface, size, wrap, sticky }),
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-2">{left}</div>
        {right ? (
          <div className="flex shrink-0 items-center gap-2">{right}</div>
        ) : null}
      </div>
    );
  },
);

/* -----------------------------------------------------------------------------
   ToolbarSeparator — an inset hairline between two groups that mean different
   things. `aria-hidden` because it is decoration; the grouping is conveyed by
   ToolbarGroup's own label, not by a line a screen reader would announce.
   --------------------------------------------------------------------------- */
export const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function ToolbarSeparator({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("mx-1 h-5 w-px shrink-0 bg-line-strong", className)}
      {...props}
    />
  );
});

/* -----------------------------------------------------------------------------
   ToolbarGroup — tight cluster of related controls inside a slot. The gap is
   smaller than the toolbar's own so the cluster reads as one unit.
   --------------------------------------------------------------------------- */
export const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function ToolbarGroup({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      className={cn("flex min-w-0 items-center gap-1", className)}
      {...props}
    />
  );
});

/* -----------------------------------------------------------------------------
   ToolbarLabel — inline meta inside a bar: "24 results", "Sorted by cost".
   `ink-tertiary` and `.tabular`, because these strings almost always contain a
   count that changes and must not nudge the controls beside it.
   --------------------------------------------------------------------------- */
export const ToolbarLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(function ToolbarLabel({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        "tabular shrink-0 text-xs whitespace-nowrap text-ink-tertiary",
        className,
      )}
      {...props}
    />
  );
});

export { toolbarVariants };
