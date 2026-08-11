"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/cn";

/* =============================================================================
   Slider
   =============================================================================
   The third and last permitted neumorphic component.

   UX NOTES
   --------
   • WHY NEUMORPHISM: the groove (`.neu-inset`) and the thumb (`.neu-raised`)
     describe a physical mechanism. No text sits on either.

   • THE FILLED INDICATOR IS NOT OPTIONAL. The neumorphic groove says "something
     slides here"; only the accent-filled portion says *how much*. A purely
     neumorphic slider is the canonical example of the style failing: pretty,
     and impossible to read the value from.

   • ALWAYS SHOW THE NUMBER. A slider communicates approximate magnitude well
     and exact value terribly. Pair it with a live readout (`showValue`) unless
     the precise number genuinely does not matter. For values users type or
     compare exactly, a number input beats a slider outright.

   • Thumb is 20px with a 44px hit area extended via padding — the visible
     control can be small, the target cannot.
   ============================================================================= */

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSlider.Root>, "className"> {
  className?: string;
  /** Visible label, rendered on an opaque surface. */
  label?: React.ReactNode;
  /** Show the live numeric readout. On by default — see UX notes. */
  showValue?: boolean;
  /** Appended to the readout, e.g. "s" or "%". */
  unit?: string;
}

export const Slider = React.forwardRef<
  React.ComponentRef<typeof BaseSlider.Root>,
  SliderProps
>(function Slider(
  { className, label, showValue = true, unit, ...props },
  ref,
) {
  return (
    <BaseSlider.Root ref={ref} className={cn("w-full", className)} {...props}>
      {(label || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && (
            <BaseSlider.Label className="text-sm font-medium text-ink">
              {label}
            </BaseSlider.Label>
          )}
          {showValue && (
            <BaseSlider.Value className="tabular font-mono text-xs text-ink-tertiary">
              {(formatted) => (
                <>
                  {formatted}
                  {unit}
                </>
              )}
            </BaseSlider.Value>
          )}
        </div>
      )}

      {/* Vertical padding on Control extends the pointer target well past the
          4px groove without making the groove itself look chunky. */}
      <BaseSlider.Control className="flex w-full touch-none items-center py-2.5 select-none">
        <BaseSlider.Track className="neu-inset h-1.5 w-full rounded-full">
          {/* The part that actually communicates the value. */}
          <BaseSlider.Indicator className="rounded-full bg-accent" />
          <BaseSlider.Thumb
            className={cn(
              "neu-raised size-5 rounded-full",
              "transition-transform duration-(--duration-instant) ease-(--ease-out-quint)",
              "active:scale-95",
              "data-disabled:cursor-not-allowed data-disabled:opacity-50",
            )}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
});
