"use client";

import * as React from "react";
import { Accordion } from "@base-ui/react/accordion";
import type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps,
} from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Accordion — progressive disclosure for a stack of headings.
   =============================================================================

   Base UI parts: Root · Item · Header · Trigger · Panel. `AccordionTrigger`
   wraps itself in `Accordion.Header` so the heading level is never accidentally
   dropped — a screen reader user navigating by heading is the main reason this
   pattern beats a list of buttons.

   UX NOTES
   --------
   • The height transition animates `--accordion-panel-height`, a real measured
     pixel value Base UI publishes on the panel, with `data-starting-style:h-0`
     and `data-ending-style:h-0` as the endpoints. Animating to `height: auto` is
     not possible in CSS, and the usual workaround (max-height guessed high)
     makes short panels open slowly and tall ones clip.
   • 220ms (`--duration-normal`) both ways. Collapse is not faster than expand:
     asymmetric timing makes the panel feel like it is being snatched away.
   • The chevron rotates 180° on `data-panel-open`. It is a persistent affordance
     that reads correctly at rest ("this opens") and while open ("this closes") —
     a plus-to-minus swap only reads correctly once you already know the pattern.
   • Single-open is the default (`multiple` opts in). If several panels can be
     open at once the page height becomes unpredictable and the user loses their
     scroll position; single-open keeps the list a fixed set of landmarks.
   • `hiddenUntilFound` exists on Root and is worth turning on for reference
     content: it lets the browser's own Ctrl+F find text inside a closed panel
     and expand it. Text the user cannot search is text they cannot find.
   • `separated` gives each item its own card. Use it when items are peers a user
     picks between; use the default flush list when they are one document's
     sections.
   ============================================================================= */

const accordionRootVariants = cva("w-full", {
  variants: {
    variant: {
      /* One document, hairline-divided sections. */
      flush: "divide-y divide-line-inner",
      /* Peers: each item is its own object. */
      separated: "flex flex-col gap-2",
    },
  },
  defaultVariants: {
    variant: "flush",
  },
});

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      flush: "",
      separated: "rounded-2xl bg-surface px-1 shadow-xs",
    },
  },
  defaultVariants: {
    variant: "flush",
  },
});

/* Root declares the variant; Item reads it, so the two cannot disagree. */
type AccordionVariant = "flush" | "separated";
const AccordionVariantContext = React.createContext<AccordionVariant>("flush");

export interface AccordionRootComponentProps
  extends Omit<AccordionRootProps, "className">,
    VariantProps<typeof accordionRootVariants> {
  className?: string;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootComponentProps>(
  function AccordionRoot({ className, variant = "flush", ...props }, ref) {
    return (
      <AccordionVariantContext.Provider value={variant ?? "flush"}>
        <Accordion.Root
          ref={ref}
          className={cn(accordionRootVariants({ variant }), className)}
          {...props}
        />
      </AccordionVariantContext.Provider>
    );
  },
);

export interface AccordionItemComponentProps
  extends Omit<AccordionItemProps, "className"> {
  className?: string;
  /** Overrides the variant inherited from `AccordionRoot`. */
  variant?: AccordionVariant;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemComponentProps>(
  function AccordionItem({ className, variant, ...props }, ref) {
    const inherited = React.useContext(AccordionVariantContext);
    return (
      <Accordion.Item
        ref={ref}
        className={cn(
          accordionItemVariants({ variant: variant ?? inherited }),
          className,
        )}
        {...props}
      />
    );
  },
);

export interface AccordionTriggerComponentProps
  extends Omit<AccordionTriggerProps, "className"> {
  className?: string;
  /** Escape hatch for the wrapping `Accordion.Header` (an `<h3>`). */
  headerClassName?: string;
  /** Replaces the chevron. Pass `null` to drop the indicator entirely. */
  indicator?: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerComponentProps>(
  function AccordionTrigger(
    { className, headerClassName, indicator, children, ...props },
    ref,
  ) {
    return (
      <Accordion.Header className={cn("flex", headerClassName)}>
        <Accordion.Trigger
          ref={ref}
          className={cn(
            "group flex w-full items-center justify-between gap-4",
            "px-3 py-3.5 text-left text-base font-medium text-ink",
            "cursor-pointer select-none",
            "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
            "hover:text-ink data-disabled:pointer-events-none data-disabled:text-ink-muted",
            className,
          )}
          {...props}
        >
          <span className="min-w-0 flex-1">{children}</span>
          {indicator === undefined ? (
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-ink-tertiary",
                "transition-transform duration-(--duration-normal) ease-(--ease-out-quint)",
                "group-data-panel-open:rotate-180",
              )}
            />
          ) : (
            indicator
          )}
        </Accordion.Trigger>
      </Accordion.Header>
    );
  },
);

export interface AccordionPanelComponentProps
  extends Omit<AccordionPanelProps, "className"> {
  className?: string;
  /** Escape hatch for the inner element that carries the panel's padding. */
  contentClassName?: string;
}

const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelComponentProps>(
  function AccordionPanel({ className, contentClassName, children, ...props }, ref) {
    return (
      <Accordion.Panel
        ref={ref}
        className={cn(
          /* The panel itself owns only height + clipping. Padding MUST live on
             the inner element: padding on an element animating to height 0
             leaves a residual band that never closes. */
          "h-(--accordion-panel-height) overflow-hidden",
          "transition-[height] duration-(--duration-normal) ease-(--ease-out-quint)",
          "data-starting-style:h-0 data-ending-style:h-0",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "px-3 pt-0 pb-4 text-base text-ink-secondary",
            contentClassName,
          )}
        >
          {children}
        </div>
      </Accordion.Panel>
    );
  },
);

/* Re-exported for callers that need to control the heading level themselves. */
const AccordionHeader = Accordion.Header;

export {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  accordionRootVariants,
  accordionItemVariants,
};
