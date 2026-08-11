import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "@/lib/cn";

/* =============================================================================
   Separator
   =============================================================================
   UX NOTES
   --------
   • Reach for whitespace and a tonal shift BEFORE reaching for a line. The most
     premium-feeling interfaces are mostly invisible structure; a rule on every
     boundary turns a layout into a spreadsheet.
   • Legitimate uses: separating semantically different groups inside one menu,
     and dividing dense table rows where whitespace would cost too much height.
   • Uses `--color-line` (ink at 8% alpha) rather than a solid grey so the same
     token works on canvas, on a card, and on a sunken fill.
   ============================================================================= */

export interface SeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseSeparator>, "className"> {
  className?: string;
  orientation?: "horizontal" | "vertical";
  /** Faintest variant, for boundaries that barely need marking. */
  soft?: boolean;
}

export const Separator = React.forwardRef<
  React.ComponentRef<typeof BaseSeparator>,
  SeparatorProps
>(function Separator({ className, orientation = "horizontal", soft, ...props }, ref) {
  return (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      className={cn(
        soft ? "bg-line-soft" : "bg-line",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
});
