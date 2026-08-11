"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import type {
  TabsIndicatorProps,
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
} from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Tabs — sibling views, one at a time.
   =============================================================================

   Base UI parts: Root · List · Tab · Indicator · Panel.

   UX NOTES
   --------
   • Two visual variants, and they are NOT interchangeable:
       `underline` — page-level sections. The rule reads as a boundary between
                     navigation and content, so it scales to a wide row and to
                     long labels.
       `pill`      — a small in-card switcher (2–4 short options). Lives in a
                     `.neu-inset` well: the one place neumorphism is allowed in
                     this kit, because pressed-vs-unpressed *is* the information
                     and the labels sit on an opaque sibling, never on the well.
   • The indicator is a single element that TRANSLATES between tabs rather than
     one border per tab fading in and out. Movement tells you where you came
     from; a crossfade only tells you where you are. Base UI publishes
     `--active-tab-width` / `--active-tab-left` on the List for exactly this.
   • Indicator motion is `--duration-normal` (220ms) — slower than a hover but
     faster than a panel change, so the eye can actually follow the travel.
   • Panels do not animate their content. A tab switch is a jump between peers,
     not a reveal; fading the body in makes a 0ms operation feel like a load.
   • `activateOnFocus` is left OFF (Base UI's default). With it on, arrowing past
     a tab mounts its panel — which for a data view means firing work the user
     never asked for. They press Enter when they mean it.
   • Never fewer than two tabs. One tab is a heading wearing a costume.
   ============================================================================= */

type TabsVariant = "underline" | "pill";

/* The variant is declared once on the List and read by Tab and Indicator. Doing
   it through context rather than repeating the prop keeps the three parts from
   ever disagreeing — a mismatched pair looks like a rendering bug. */
const TabsVariantContext = React.createContext<TabsVariant>("underline");

const tabsListVariants = cva("relative flex items-center", {
  variants: {
    variant: {
      underline: "gap-1 border-b border-line-inner",
      pill: "neu-inset gap-1 rounded-lg p-1",
    },
  },
  defaultVariants: {
    variant: "underline",
  },
});

const tabsTabVariants = cva(
  [
    "relative z-(--z-local) inline-flex shrink-0 items-center justify-center gap-2",
    "font-medium whitespace-nowrap select-none",
    "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
    "data-disabled:pointer-events-none data-disabled:text-ink-muted",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        underline: [
          /* -1px pulls the tab's own baseline onto the list's border so the
             indicator sits exactly on the rule instead of near it. */
          "h-9 -mb-px px-3 text-sm text-ink-tertiary",
          "hover:text-ink-secondary",
          "data-active:text-ink",
        ],
        pill: [
          "h-8 rounded-md px-3 text-sm text-ink-tertiary",
          "hover:text-ink-secondary",
          "data-active:text-ink",
        ],
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  },
);

const tabsIndicatorVariants = cva(
  [
    "absolute left-0 w-(--active-tab-width) translate-x-(--active-tab-left)",
    "transition-[translate,width] duration-(--duration-normal) ease-(--ease-out-quint)",
  ],
  {
    variants: {
      variant: {
        /* A 2px accent rule sitting on the list's hairline. */
        underline: "bottom-0 h-[2px] rounded-full bg-accent",
        /* A raised nub filling the well, inset by the well's 4px padding. */
        pill: "neu-raised top-1 bottom-1 h-auto rounded-md",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  },
);

export interface TabsListComponentProps
  extends Omit<TabsListProps, "className">,
    VariantProps<typeof tabsListVariants> {
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListComponentProps>(
  function TabsList({ className, variant = "underline", ...props }, ref) {
    return (
      <TabsVariantContext.Provider value={variant ?? "underline"}>
        <Tabs.List
          ref={ref}
          className={cn(tabsListVariants({ variant }), className)}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  },
);

export interface TabsTabComponentProps extends Omit<TabsTabProps, "className"> {
  className?: string;
  /** Overrides the variant inherited from `TabsList`. Rarely needed. */
  variant?: TabsVariant;
}

const TabsTab = React.forwardRef<HTMLElement, TabsTabComponentProps>(
  function TabsTab({ className, variant, ...props }, ref) {
    const inherited = React.useContext(TabsVariantContext);
    return (
      <Tabs.Tab
        ref={ref}
        className={cn(tabsTabVariants({ variant: variant ?? inherited }), className)}
        {...props}
      />
    );
  },
);

export interface TabsIndicatorComponentProps
  extends Omit<TabsIndicatorProps, "className"> {
  className?: string;
  /** Overrides the variant inherited from `TabsList`. Rarely needed. */
  variant?: TabsVariant;
}

const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorComponentProps>(
  function TabsIndicator({ className, variant, ...props }, ref) {
    const inherited = React.useContext(TabsVariantContext);
    return (
      <Tabs.Indicator
        ref={ref}
        /* Renders before hydration so an SSR'd page does not show a naked tab
           row for a frame and then snap the indicator into place. */
        renderBeforeHydration
        className={cn(
          tabsIndicatorVariants({ variant: variant ?? inherited }),
          className,
        )}
        {...props}
      />
    );
  },
);

export interface TabsPanelComponentProps extends Omit<TabsPanelProps, "className"> {
  className?: string;
}

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelComponentProps>(
  function TabsPanel({ className, ...props }, ref) {
    return (
      <Tabs.Panel
        ref={ref}
        className={cn("mt-4 outline-none", className)}
        {...props}
      />
    );
  },
);

export interface TabsRootComponentProps extends Omit<TabsRootProps, "className"> {
  className?: string;
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootComponentProps>(
  function TabsRoot({ className, ...props }, ref) {
    return <Tabs.Root ref={ref} className={cn("w-full", className)} {...props} />;
  },
);

export {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
  tabsListVariants,
  tabsTabVariants,
  tabsIndicatorVariants,
};
