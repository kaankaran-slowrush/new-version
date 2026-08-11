"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import type {
  PopoverDescriptionProps,
  PopoverPopupProps,
  PopoverPositionerProps,
  PopoverTitleProps,
} from "@base-ui/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Popover — a small, dismissible panel of *content* anchored to a trigger.
   =============================================================================

   Base UI parts: Root · Trigger · Portal · Positioner · Popup · Title ·
   Description · Close · Arrow. `PopoverContent` composes Portal + Positioner +
   Popup.

   WHEN TO USE WHICH OVERLAY
   -------------------------
     Tooltip  — a label. No interactive content. Opens on hover. Never focusable.
     Menu     — a list of actions. One choice, then it closes.
     Popover  — content you can read, focus and interact with. Stays until
                dismissed. Reach for this the moment a menu would need a text
                field, a chart or a paragraph inside it.
     Dialog   — blocks the page. Use only when the task must be finished or
                abandoned before anything else can happen.

   UX NOTES
   --------
   • OPAQUE `bg-surface` + `shadow-md`, for the same reason as the menu: it lands
     over unknown content, so translucency would stack two paragraphs of text on
     top of each other.
   • ORIGIN-AWARE ENTRY via `--transform-origin` plus `data-[side=…]`, so the
     panel grows out of its trigger's edge. The 4px directional slide is what
     makes the connection legible without drawing a literal arrow.
   • NO ARROW by default, even though Base UI provides `Popover.Arrow`. The panel
     carries a real 1.5px `.panel-edge` border, and that border cannot be continued
     around a rotated square without a visible seam where the arrow meets the
     panel — the thicker the edge, the worse the seam, so this got *more* true when
     definition moved from shadow ring to border. Proximity, `sideOffset={6}` and
     the directional entry already say "this belongs to that button".
     `Popover.Arrow` is re-exported for callers who accept the seam.
   • 160ms, matching the menu. Popovers and menus are peers in the same layer;
     if one animated slower the layer would feel inconsistent depending on which
     button you pressed.
   • `align="center"` here but `"start"` on menus: a popover is a block of
     content whose visual mass wants to sit under the middle of its trigger,
     where a menu is a column of labels that wants its text left edge aligned.
   ============================================================================= */

const popoverPopupVariants = cva(
  [
    "panel-edge flex flex-col rounded-2xl bg-surface text-ink shadow-md outline-none",
    "max-h-[var(--available-height)] max-w-[var(--available-width)]",
    "origin-(--transform-origin)",
    "transition-[opacity,scale,translate]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    "data-starting-style:opacity-0 data-starting-style:scale-[0.96]",
    "data-ending-style:opacity-0 data-ending-style:scale-[0.96]",
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
      size: {
        sm: "w-max min-w-[13rem] max-w-[16rem] p-3",
        md: "w-max min-w-[17rem] max-w-[22rem] p-4",
        lg: "w-max min-w-[22rem] max-w-[30rem] p-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface PopoverContentProps
  extends Omit<PopoverPopupProps, "className">,
    VariantProps<typeof popoverPopupVariants> {
  className?: string;
  /** Which side of the trigger to open on. @default "bottom" */
  side?: PopoverPositionerProps["side"];
  /** Alignment along that side. @default "center" */
  align?: PopoverPositionerProps["align"];
  /** Gap between trigger and panel, in px. @default 6 */
  sideOffset?: PopoverPositionerProps["sideOffset"];
  /** Offset along the alignment axis, in px. */
  alignOffset?: PopoverPositionerProps["alignOffset"];
  /** Escape hatch for the positioner element. */
  positionerClassName?: string;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    {
      className,
      positionerClassName,
      size,
      side = "bottom",
      align = "center",
      sideOffset = 6,
      alignOffset,
      ...props
    },
    ref,
  ) {
    return (
      <Popover.Portal>
        <Popover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn("z-(--z-dropdown) outline-none", positionerClassName)}
        >
          <Popover.Popup
            ref={ref}
            className={cn(popoverPopupVariants({ size }), className)}
            {...props}
          />
        </Popover.Positioner>
      </Popover.Portal>
    );
  },
);

export interface PopoverTitleComponentProps
  extends Omit<PopoverTitleProps, "className"> {
  className?: string;
}

const PopoverTitle = React.forwardRef<HTMLHeadingElement, PopoverTitleComponentProps>(
  function PopoverTitle({ className, ...props }, ref) {
    return (
      <Popover.Title
        ref={ref}
        className={cn("text-base font-medium text-ink", className)}
        {...props}
      />
    );
  },
);

export interface PopoverDescriptionComponentProps
  extends Omit<PopoverDescriptionProps, "className"> {
  className?: string;
}

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionComponentProps
>(function PopoverDescription({ className, ...props }, ref) {
  return (
    <Popover.Description
      ref={ref}
      className={cn("mt-1 text-sm text-ink-secondary", className)}
      {...props}
    />
  );
});

/* Unstyled pass-throughs. */
const PopoverRoot = Popover.Root;
const PopoverTrigger = Popover.Trigger;
const PopoverClose = Popover.Close;
const PopoverArrow = Popover.Arrow;
const PopoverPortal = Popover.Portal;
const PopoverPositioner = Popover.Positioner;

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverArrow,
  PopoverPortal,
  PopoverPositioner,
  popoverPopupVariants,
};
