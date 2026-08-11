"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { RadioGroupProps as BaseRadioGroupProps } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import type { RadioRootProps } from "@base-ui/react/radio";
import { cn } from "@/lib/cn";

/* =============================================================================
   RadioGroup / Radio — pick exactly one from a small, visible set.
   =============================================================================

   Conventions from `button.tsx`: `cva` for the size matrix, `className` merged
   LAST, `forwardRef`, no locally invented focus ring. Roving-tabindex keyboard
   behaviour, the hidden inputs and the group semantics come from Base UI's
   `RadioGroup` + `Radio.Root` / `Radio.Indicator`; this file is the skin.

   ```tsx
   <RadioGroup defaultValue="balanced">
     <FieldItem>
       <Radio value="fast" />
       <FieldLabel>Fastest</FieldLabel>
     </FieldItem>
     …
   </RadioGroup>
   ```

   UX NOTES
   --------
   • ROUND MEANS EXCLUSIVE, SQUARE MEANS INDEPENDENT. The circle here and the
     rounded-rect in `checkbox.tsx` are not a style choice — they are the only
     signal that tells a user, before clicking, whether picking this option will
     un-pick their previous one. Never make a checkbox round.

   • RADIO OVER SELECT UNDER ~6 OPTIONS. A radio group shows every choice and its
     relative weight at once; a dropdown hides them behind a click and hides the
     fact that a choice exists at all. Above ~6 the group starts to dominate the
     form and a select wins.

   • THE DOT SITS INSIDE A FILLED RING. Unchecked is the same
     `bg-surface-sunken` well as every other input; checked floods the disc with
     accent and punches a white dot out of it. Two differences (fill area + the
     dot), so the selected row is readable when scanning a column and is not
     carried by hue alone.

   • VERTICAL BY DEFAULT. Horizontal radio rows make it ambiguous which label
     belongs to which control — the gap to the left neighbour's text competes with
     the gap to your own. Use `orientation="horizontal"` only for two or three
     very short labels.

   • NO NEUMORPHISM, same reasoning as `checkbox.tsx`: this control has to be
     legible while scanning, and neumorphism trades contrast for physicality.

   • VERTICAL GAP IS 10px, not 4px. Radios that touch read as one block of text
     and the click targets fuse; the group needs to read as *n* separate choices.

   • Selecting is instant; only the fill transitions. `Radio` has no `lg`-at-44px
     variant because the label beside it is part of the hit target — see the
     matching note in `checkbox.tsx`.
   ============================================================================= */

const radioGroupVariants = cva("flex", {
  variants: {
    orientation: {
      /* 10px: separate enough to read as distinct choices, tight enough to
         still read as one group. */
      vertical: "flex-col gap-2.5",
      /* Wider horizontal gap — see UX NOTES on label ownership. */
      horizontal: "flex-row flex-wrap items-center gap-x-6 gap-y-2.5",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface RadioGroupProps
  extends Omit<BaseRadioGroupProps, "className">,
    VariantProps<typeof radioGroupVariants> {
  className?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup({ className, orientation, ...props }, ref) {
    return (
      <BaseRadioGroup
        ref={ref}
        className={cn(radioGroupVariants({ orientation }), className)}
        {...props}
      />
    );
  },
);

const radioVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full",
    "border border-line-strong bg-surface-sunken",
    "transition-[background-color,border-color]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    "hover:bg-surface-active",
    "data-[checked]:border-accent data-[checked]:bg-accent",
    "data-[invalid]:border-danger",
    "data-[disabled]:cursor-not-allowed data-[disabled]:border-line data-[disabled]:bg-surface",
    "data-[disabled]:hover:bg-surface",
    "data-[disabled]:data-[checked]:border-ink-muted data-[disabled]:data-[checked]:bg-ink-muted",
  ],
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-4.5",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const radioIndicatorVariants = cva(
  [
    "rounded-full bg-accent-text",
    "transition-[scale,opacity]",
    "duration-(--duration-instant) ease-(--ease-out-quint)",
    "data-[starting-style]:scale-50 data-[starting-style]:opacity-0",
    "data-[ending-style]:scale-50 data-[ending-style]:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "size-1.5",
        md: "size-2",
        lg: "size-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface RadioProps
  extends Omit<RadioRootProps, "className">,
    VariantProps<typeof radioVariants> {
  className?: string;
  /** Escape hatch for the inner dot. */
  indicatorClassName?: string;
}

export const Radio = React.forwardRef<HTMLElement, RadioProps>(function Radio(
  { className, indicatorClassName, size, ...props },
  ref,
) {
  return (
    <BaseRadio.Root
      ref={ref}
      className={cn(radioVariants({ size }), className)}
      {...props}
    >
      <BaseRadio.Indicator
        className={cn(radioIndicatorVariants({ size }), indicatorClassName)}
      />
    </BaseRadio.Root>
  );
});

export { radioGroupVariants, radioVariants };
