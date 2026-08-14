"use client";

import * as React from "react";
import { Select } from "@base-ui/react/select";
import type {
  SelectGroupLabelProps,
  SelectItemProps,
  SelectPopupProps,
  SelectPositionerProps,
  SelectTriggerProps,
  SelectValueProps,
} from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Select — choose one of a known, closed set.
   =============================================================================

   Base UI parts: Root · Label · Trigger · Value · Icon · Portal · Positioner ·
   Popup · List · Item · ItemText · ItemIndicator · Group · GroupLabel ·
   Separator · ScrollUpArrow · ScrollDownArrow. `SelectContent` composes Portal +
   Positioner + Popup + List; `SelectOption` composes Item + Indicator + Text.

   UX NOTES
   --------
   • The TRIGGER is styled as an input (`bg-surface-sunken`, `rounded-lg`,
     36px) and the POPUP as an overlay (`bg-surface`, `rounded-2xl`, `shadow-md`).
     That is deliberate: sunken means "you put something in here", raised means
     "this is floating above and will go away". Giving both the same treatment is
     the most common way selects end up feeling ambiguous.
   • `alignItemWithTrigger` is DEFAULTED OFF. Base UI's default overlaps the
     popup on the trigger so the selected row lands on the trigger's text — a
     genuinely nice macOS behaviour, but it reports `data-[side=none]`, which
     means no side, no `--transform-origin`, and therefore no origin-aware
     motion. This kit prefers the predictable anchored dropdown; pass
     `alignItemWithTrigger` to opt back in.
   • The check sits in a fixed 1rem column via a two-column grid, so labels align
     whether or not a row is selected. Indenting only the selected row is the
     classic jitter bug here.
   • Rows respond to `data-highlighted` (pointer hover AND keyboard roving focus
     unified) and mark selection with `data-selected`. Selection is shown by the
     check, not by colour alone — a highlighted row and a selected row must stay
     distinguishable while arrowing through the list.
   • `max-h-[var(--available-height)]` on the List: Base UI measures the real gap
     to the viewport edge, so a long list scrolls inside the popup instead of
     running off screen or flipping to a cramped side.
   • For an open-ended set (search, tags, anything the user can type), this is the
     wrong control — use an autocomplete/combobox. A select's promise is that
     every option is visible somewhere in the list.
   ============================================================================= */

const selectTriggerVariants = cva(
  [
    "flex w-full items-center justify-between gap-2",
    "rounded-lg bg-surface-sunken px-3 text-left",
    "text-sm text-ink select-none",
    "transition-[background-color,box-shadow,color] duration-(--duration-fast) ease-(--ease-out-quint)",
    "hover:bg-surface-active",
    "data-popup-open:bg-surface-active",
    "data-disabled:pointer-events-none data-disabled:text-ink-muted",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      size: {
        sm: "h-(--control-height-sm) text-sm",
        md: "h-(--control-height-md) text-sm",
        lg: "h-(--control-height-lg) rounded-lg text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SelectTriggerComponentProps
  extends Omit<SelectTriggerProps, "className">,
    VariantProps<typeof selectTriggerVariants> {
  className?: string;
  /** Placeholder shown while nothing is selected. */
  placeholder?: SelectValueProps["placeholder"];
  /**
   * Renders the default `Value` + chevron. Pass children instead to take over
   * the trigger's inside completely.
   */
  children?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerComponentProps>(
  function SelectTrigger({ className, size, placeholder, children, ...props }, ref) {
    return (
      <Select.Trigger
        ref={ref}
        className={cn(selectTriggerVariants({ size }), className)}
        {...props}
      >
        {children ?? (
          <>
            <Select.Value
              className="min-w-0 truncate data-placeholder:text-ink-muted"
              placeholder={placeholder}
            />
            <Select.Icon>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 text-ink-tertiary",
                  "transition-transform duration-(--duration-fast) ease-(--ease-out-quint)",
                )}
              />
            </Select.Icon>
          </>
        )}
      </Select.Trigger>
    );
  },
);

const selectPopupVariants = cva([
  "panel-edge rounded-2xl bg-surface-solid p-1.5 shadow-md outline-none",
  "min-w-[var(--anchor-width)]",
  "origin-(--transform-origin)",
  "transition-[opacity,scale,translate]",
  "duration-(--duration-fast) ease-(--ease-out-quint)",
  "data-starting-style:opacity-0 data-starting-style:scale-[0.96]",
  "data-ending-style:opacity-0 data-ending-style:scale-[0.96]",
  "data-[side=bottom]:data-starting-style:-translate-y-1",
  "data-[side=bottom]:data-ending-style:-translate-y-1",
  "data-[side=top]:data-starting-style:translate-y-1",
  "data-[side=top]:data-ending-style:translate-y-1",
  /* `side=none` is what Base UI reports when `alignItemWithTrigger` is on. There
     is no anchor edge to grow from, so fall back to a plain fade. */
  "data-[side=none]:origin-center",
  "data-[side=none]:data-starting-style:scale-100",
  "data-[side=none]:data-ending-style:scale-100",
]);

export interface SelectContentProps extends Omit<SelectPopupProps, "className"> {
  className?: string;
  /** Which side of the trigger to open on. @default "bottom" */
  side?: SelectPositionerProps["side"];
  /** Alignment along that side. @default "start" */
  align?: SelectPositionerProps["align"];
  /** Gap between trigger and popup, in px. @default 6 */
  sideOffset?: SelectPositionerProps["sideOffset"];
  /**
   * Overlap the trigger so the selected row's text lines up with the trigger's.
   * @default false — see UX NOTES.
   */
  alignItemWithTrigger?: boolean;
  /** Escape hatch for the positioner element. */
  positionerClassName?: string;
  /** Escape hatch for the scrolling list element. */
  listClassName?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(
    {
      className,
      positionerClassName,
      listClassName,
      side = "bottom",
      align = "start",
      sideOffset = 6,
      alignItemWithTrigger = false,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Select.Portal>
        <Select.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignItemWithTrigger={alignItemWithTrigger}
          className={cn(
            "z-(--z-dropdown) outline-none select-none",
            positionerClassName,
          )}
        >
          <Select.Popup
            ref={ref}
            className={cn(selectPopupVariants(), className)}
            {...props}
          >
            <Select.List
              className={cn(
                "max-h-[var(--available-height)] overflow-y-auto overscroll-contain",
                listClassName,
              )}
            >
              {children}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    );
  },
);

export interface SelectOptionProps extends Omit<SelectItemProps, "className"> {
  className?: string;
}

/**
 * One row. Composes Item + ItemIndicator + ItemText so a caller writes
 * `<SelectOption value="x">Label</SelectOption>` and still gets the correct
 * `ItemText` element that Base UI reads for typeahead and the trigger's value.
 */
const SelectOption = React.forwardRef<HTMLElement, SelectOptionProps>(
  function SelectOption({ className, children, ...props }, ref) {
    return (
      <Select.Item
        ref={ref}
        className={cn(
          "grid cursor-default grid-cols-[1rem_1fr] items-center gap-2",
          "rounded-sm py-2 pr-3 pl-2.5",
          "text-sm text-ink-secondary select-none outline-none",
          "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
          "data-highlighted:bg-surface-hover data-highlighted:text-ink",
          "hover:bg-surface-hover hover:text-ink",
          "data-selected:text-ink",
          "data-disabled:pointer-events-none data-disabled:text-ink-muted",
          className,
        )}
        {...props}
      >
        <Select.ItemIndicator className="col-start-1 flex items-center">
          <Check aria-hidden className="size-3.5 text-accent-ink" />
        </Select.ItemIndicator>
        <Select.ItemText className="col-start-2 truncate">
          {children}
        </Select.ItemText>
      </Select.Item>
    );
  },
);

export interface SelectGroupLabelComponentProps
  extends Omit<SelectGroupLabelProps, "className"> {
  className?: string;
}

const SelectGroupLabel = React.forwardRef<
  HTMLDivElement,
  SelectGroupLabelComponentProps
>(function SelectGroupLabel({ className, ...props }, ref) {
  return (
    <Select.GroupLabel
      ref={ref}
      className={cn(
        "eyebrow px-2.5 pt-2 pb-1",
        "text-ink-tertiary select-none",
        className,
      )}
      {...props}
    />
  );
});

export interface SelectSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Select.Separator>, "className"> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, ...props }, ref) {
    return (
      <Select.Separator
        ref={ref}
        className={cn("mx-1.5 my-1.5 h-px bg-line", className)}
        {...props}
      />
    );
  },
);

/* Unstyled pass-throughs. `Root` keeps its `<Value, Multiple>` generics only if
   it is re-exported rather than wrapped. */
const SelectRoot = Select.Root;
const SelectLabel = Select.Label;
const SelectValue = Select.Value;
const SelectIcon = Select.Icon;
const SelectGroup = Select.Group;
const SelectPortal = Select.Portal;
const SelectPositioner = Select.Positioner;
const SelectList = Select.List;
const SelectItemIndicator = Select.ItemIndicator;
const SelectItemText = Select.ItemText;

export {
  SelectRoot,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectOption,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
  SelectPortal,
  SelectPositioner,
  SelectList,
  SelectItemIndicator,
  SelectItemText,
  selectTriggerVariants,
  selectPopupVariants,
};
