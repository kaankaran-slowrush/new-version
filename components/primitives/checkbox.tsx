"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { CheckboxRootProps } from "@base-ui/react/checkbox";
import { cn } from "@/lib/cn";

/* =============================================================================
   Checkbox — independent on/off for one option.
   =============================================================================

   Conventions from `button.tsx`: `cva` for the size matrix, `className` merged
   LAST, `forwardRef`, no locally invented focus ring. Behaviour, keyboard support
   and the hidden `<input>` come from Base UI's `Checkbox.Root` /
   `Checkbox.Indicator`; this file is purely the skin.

   Pair it with `FieldItem` + `FieldLabel` from `field.tsx` to get a labelled row:

   ```tsx
   <FieldItem>
     <Checkbox name="telemetry" defaultChecked />
     <FieldLabel>Share anonymous telemetry</FieldLabel>
   </FieldItem>
   ```

   UX NOTES
   --------
   • UNCHECKED IS A WELL, CHECKED IS A FILL. At rest the box is
     `bg-surface-sunken` with a visible hairline — the same "put something here"
     recess as `Input`. Ticking it floods the box with `--color-accent`. The state
     therefore differs in FILL AREA, not just in whether a small glyph is present,
     so it survives being read at a glance down a column of twenty rows.

   • NOT NEUMORPHIC, deliberately. A checkbox has to be legible while *scanning*,
     and neumorphism's whole trick is removing contrast between control and
     ground. Only switch / segmented-control / slider — where pressed-vs-unpressed
     physicality is itself the information — are allowed that treatment here.

   • CHECKED IS NOT COLOUR ALONE. The accent fill is accompanied by the tick
     glyph, so a user who cannot separate the accent from the neutral still reads
     the mark. Same rule as `Input`'s invalid state, applied to a positive state.

   • INDETERMINATE USES A DASH, NOT A SMALLER TICK. It means "some of the children
     below are on" — a distinct third state, so it needs a distinct glyph. A faded
     or shrunken tick reads as a rendering bug.

   • DISABLED-AND-CHECKED KEEPS ITS FILL, just in `--color-ink-muted` instead of
     accent. Draining it to an empty box would misreport the value — the setting
     is still on, it just cannot be altered.

   • The box hits 20px at `lg` only. A checkbox is never the sole touch target for
     an action: the label beside it is part of the same hit area (that is what
     `FieldItem` + a real `<label>` buy you), which is how the row clears WCAG 2.2
     target size without drawing a 44px square.

   • The tick scales in from `data-[starting-style]` over `--duration-instant`.
     Fast enough to read as a receipt for the click, not as an animation.
   ============================================================================= */

const checkboxVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "border border-line-strong bg-surface-sunken text-transparent",
    "transition-[background-color,border-color,color]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    "hover:border-line-strong hover:bg-surface-active",
    "data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:text-accent-text",
    "data-[indeterminate]:border-accent data-[indeterminate]:bg-accent data-[indeterminate]:text-accent-text",
    "data-[invalid]:border-danger",
    "data-[disabled]:cursor-not-allowed data-[disabled]:border-line data-[disabled]:bg-surface-disabled",
    "data-[disabled]:hover:bg-surface-disabled",
    "data-[disabled]:data-[checked]:border-ink-muted data-[disabled]:data-[checked]:bg-ink-muted",
    "data-[disabled]:data-[indeterminate]:border-ink-muted data-[disabled]:data-[indeterminate]:bg-ink-muted",
    "[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "size-4 rounded-xs [&_svg]:size-3",
        md: "size-4.5 rounded-xs [&_svg]:size-3.5",
        lg: "size-5 rounded-sm [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface CheckboxProps
  extends Omit<CheckboxRootProps, "className">,
    VariantProps<typeof checkboxVariants> {
  className?: string;
  /** Escape hatch for the glyph wrapper. */
  indicatorClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(
  function Checkbox(
    { className, indicatorClassName, size, indeterminate, ...props },
    ref,
  ) {
    return (
      <BaseCheckbox.Root
        ref={ref}
        indeterminate={indeterminate}
        className={cn(checkboxVariants({ size }), className)}
        {...props}
      >
        <BaseCheckbox.Indicator
          className={cn(
            "flex items-center justify-center",
            "transition-[scale,opacity]",
            "duration-(--duration-instant) ease-(--ease-out-quint)",
            "data-[starting-style]:scale-50 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-50 data-[ending-style]:opacity-0",
            indicatorClassName,
          )}
        >
          {indeterminate ? (
            <Minus strokeWidth={3} aria-hidden />
          ) : (
            <Check strokeWidth={3} aria-hidden />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  },
);

export { checkboxVariants };
