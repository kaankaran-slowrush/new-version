"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";
import { cn } from "@/lib/cn";

/* =============================================================================
   Button — the reference component for this kit.
   =============================================================================

   Every other component follows the conventions established here:

     1. `cva` for the variant × size matrix, so the API is self-documenting and
        a consumer can read every legal combination in one place.
     2. `className` is merged LAST via `cn`, so a caller can always override.
     3. Native element + `forwardRef` — no wrapper div, no lost ref.
     4. Focus is inherited from the global `:focus-visible` rule; components do
        not each reinvent a focus ring.
     5. Disabled is expressed in BOTH color and cursor, never color alone.

   UX NOTES
   --------
   • One primary per view. If two things are primary, neither is.
   • `scale(0.97)` on :active is the tactile receipt that the click landed —
     the cheapest perceived-performance win available.
   • Sizes map to the shared control rhythm (32/36/44/52). `lg` at 44px is the
     WCAG 2.2 minimum target size; anything smaller than `lg` must not be the
     only way to perform an action on touch.
   • Radius grows with size (concentric-friendly): a 52px button with a 10px
     radius reads squarish, and a 32px button with a 16px radius reads like a
     pill that lost its nerve.
   ============================================================================= */

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /** Renders a leading icon slot. Sized automatically per button size. */
  startIcon?: React.ReactNode;
  /** Renders a trailing icon slot. */
  endIcon?: React.ReactNode;
  /**
   * Shows a working state. Keeps the button's width stable (the label stays in
   * the flow at zero opacity) so the layout does not jump mid-interaction.
   */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      iconOnly,
      fullWidth,
      startIcon,
      endIcon,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          buttonVariants({ variant, size, iconOnly, fullWidth }),
          className,
        )}
        {...props}
      >
        {loading && (
          /* Not a generic spinner: three marks tracing the same rhythm as the
             product's other "working" states. See docs → Motion. */
          <span className="absolute inset-0 grid place-items-center" aria-hidden>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="anim-soft-pulse size-1 rounded-full bg-current"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </span>
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "invisible",
          )}
        >
          {startIcon}
          {children}
          {endIcon}
        </span>
      </button>
    );
  },
);

