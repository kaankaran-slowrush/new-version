"use client";

import * as React from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import type {
  TooltipPopupProps,
  TooltipPositionerProps,
} from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Tooltip — a name for something that has none.
   =============================================================================

   Base UI parts: Provider · Root · Trigger · Portal · Positioner · Popup ·
   Arrow. `TooltipContent` composes Portal + Positioner + Popup.

   UX NOTES
   --------
   • A tooltip may contain ONLY a short label. It is invisible to touch users and
     unreachable by pointer for anyone who cannot hover, so anything essential
     put inside one is, for those users, not in the product. Icon-only buttons
     still need `aria-label` — the tooltip is not the accessible name.
   • INVERTED, not `bg-surface`. The opaque-surface rule in this kit covers
     menus, popovers and dialogs — surfaces you *act on*. A tooltip is a passing
     annotation, and giving it the same white card treatment makes a 20px label
     look like a panel that failed to load its content. `bg-ink text-canvas` is
     unmistakably a different class of object, and inverting also buys the
     highest contrast available for the smallest text in the kit.
   • `rounded-md`, not `rounded-2xl`. An 18px radius on a 26px-tall chip is a
     capsule that lost its nerve; the radius scale exists so small things get
     small radii.
   • 600ms open delay is Base UI's default and it is the right one: a tooltip
     that fires instantly turns a sweep across a toolbar into a strobe. Closing
     is immediate — once you have moved on, the label is noise.
   • `data-instant:transition-none` is load-bearing here. When `Tooltip.Provider`
     groups several triggers, moving between them re-targets the tooltip with no
     delay; animating that transfer would look like a stutter rather than a move.
   • Wrap a toolbar in `TooltipProvider` so the first hover pays the delay and the
     rest are instant. That is what makes exploring a dense toolbar feel fast.
   ============================================================================= */

const tooltipPopupVariants = cva(
  [
    "rounded-md px-2 py-1 text-xs font-medium select-none",
    "shadow-sm outline-none",
    "origin-(--transform-origin)",
    "transition-[opacity,scale,translate]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    "data-starting-style:opacity-0 data-starting-style:scale-[0.94]",
    "data-ending-style:opacity-0 data-ending-style:scale-[0.94]",
    "data-[side=bottom]:data-starting-style:-translate-y-1",
    "data-[side=bottom]:data-ending-style:-translate-y-1",
    "data-[side=top]:data-starting-style:translate-y-1",
    "data-[side=top]:data-ending-style:translate-y-1",
    "data-[side=left]:data-starting-style:translate-x-1",
    "data-[side=left]:data-ending-style:translate-x-1",
    "data-[side=right]:data-starting-style:-translate-x-1",
    "data-[side=right]:data-ending-style:-translate-x-1",
    "data-[side=inline-start]:data-starting-style:translate-x-1",
    "data-[side=inline-start]:data-ending-style:translate-x-1",
    "data-[side=inline-end]:data-starting-style:-translate-x-1",
    "data-[side=inline-end]:data-ending-style:-translate-x-1",
    "data-instant:transition-none",
  ],
  {
    variants: {
      variant: {
        /* The default. See UX NOTES for why a tooltip is not a card. */
        inverted: "bg-ink text-canvas",
        /* For the rare tooltip over inverted/media chrome, where a dark chip
           would disappear into its own background. */
        surface: "bg-surface-solid text-ink shadow-md",
      },
    },
    defaultVariants: {
      variant: "inverted",
    },
  },
);

export interface TooltipContentProps
  extends Omit<TooltipPopupProps, "className">,
    VariantProps<typeof tooltipPopupVariants> {
  className?: string;
  /** Which side of the trigger to open on. @default "top" */
  side?: TooltipPositionerProps["side"];
  /** Alignment along that side. @default "center" */
  align?: TooltipPositionerProps["align"];
  /** Gap between trigger and tooltip, in px. @default 6 */
  sideOffset?: TooltipPositionerProps["sideOffset"];
  /** Escape hatch for the positioner element. */
  positionerClassName?: string;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      className,
      positionerClassName,
      variant,
      /* Above, not below: below is where the pointer already is, and a tooltip
         under the cursor is a tooltip you are about to dismiss by accident. */
      side = "top",
      align = "center",
      sideOffset = 6,
      ...props
    },
    ref,
  ) {
    return (
      <Tooltip.Portal>
        <Tooltip.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn("z-(--z-dropdown) outline-none", positionerClassName)}
        >
          <Tooltip.Popup
            ref={ref}
            className={cn(tooltipPopupVariants({ variant }), className)}
            {...props}
          />
        </Tooltip.Positioner>
      </Tooltip.Portal>
    );
  },
);

/* Unstyled pass-throughs. */
const TooltipProvider = Tooltip.Provider;
const TooltipRoot = Tooltip.Root;
const TooltipTrigger = Tooltip.Trigger;
const TooltipArrow = Tooltip.Arrow;
const TooltipPortal = Tooltip.Portal;
const TooltipPositioner = Tooltip.Positioner;

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipPortal,
  TooltipPositioner,
  tooltipPopupVariants,
};
