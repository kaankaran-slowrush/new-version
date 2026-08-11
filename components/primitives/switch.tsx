"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/lib/cn";

/* =============================================================================
   Switch
   =============================================================================
   One of exactly THREE components in this kit permitted to use neumorphism
   (the others are SegmentedControl and Slider).

   UX NOTES
   --------
   • WHY NEUMORPHISM IS ALLOWED HERE: a switch is a physical metaphor — a thing
     that slides in a groove. The pressed-in track (`.neu-inset`) and the raised
     knob (`.neu-raised`) *are* the information: you can see which part moves.
     Crucially, no text ever sits on either surface, which is what makes the
     low-contrast treatment survivable. The label lives on an opaque sibling.

   • WHY THE TRACK ALSO CHANGES COLOR: neumorphism alone cannot carry on/off —
     it fails contrast and it disappears in sunlight. So the checked state adds
     a solid accent fill on top of the inset shadow. The neumorphism supplies
     the *tactility*; the color supplies the *state*. Remove the color and this
     control becomes unusable, which is precisely the trap neumorphic UI falls
     into when it is used as a whole design language rather than a garnish.

   • WHY NOT A CHECKBOX: a switch takes effect immediately; a checkbox is a
     value you submit later. If the change needs a Save button, use Checkbox.

   • Track is 44×24 with a 20px thumb — the whole control clears the 24px WCAG
     2.2 target minimum, and the hit area is extended by the wrapping label.
   ============================================================================= */

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, "className"> {
  className?: string;
  /** Visible label. Rendered on an opaque surface, never on the track. */
  label?: React.ReactNode;
  /** Supporting line under the label. */
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof BaseSwitch.Root>,
  SwitchProps
>(function Switch({ className, label, description, id, ...props }, ref) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  const control = (
    <BaseSwitch.Root
      ref={ref}
      id={switchId}
      className={cn(
        "neu-inset relative h-6 w-11 shrink-0 rounded-full",
        "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
        "data-checked:bg-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          "neu-raised block size-5 rounded-full",
          "translate-x-0.5 transition-transform duration-(--duration-fast) ease-(--ease-out-quint)",
          "data-checked:translate-x-[1.375rem]",
        )}
      />
    </BaseSwitch.Root>
  );

  if (!label && !description) return control;

  return (
    <div className="flex items-start gap-3">
      {control}
      <div className="min-w-0">
        {label && (
          <label
            htmlFor={switchId}
            className="block cursor-pointer text-sm font-medium text-ink"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-ink-tertiary">{description}</p>
        )}
      </div>
    </div>
  );
});
