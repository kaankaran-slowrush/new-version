"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Pill
   =============================================================================
   The interactive capsule. Badge's clickable sibling.

   UX NOTES
   --------
   • This is the workhorse of the composer and every filter row: aspect ratios,
     durations, model pickers, cost readouts, active filters.
   • The `active` state is a REAL VARIANT, not an inline style override. That
     sounds obvious, but the prototype this kit was extracted from expressed
     "active" as a hardcoded inline background on one element — which meant the
     state could not be restyled, themed, or reused. If a state exists, it
     belongs in the variant map.
   • `readout` is for a pill that displays rather than acts (e.g. "Est. $0.32").
     It is transparent and non-interactive, so it reads as information sitting
     in the control row rather than another thing to click.
   • Dismiss button is a nested interactive element, so it gets its own hit area
     and its own aria-label — never rely on the parent's.
   ============================================================================= */

const pillVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-1.5 rounded-lg font-medium whitespace-nowrap",
    "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
    "disabled:cursor-not-allowed disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        default: "bg-surface-sunken text-ink-secondary hover:text-ink",
        active: "bg-accent text-accent-text",
        outline:
          "bg-transparent text-ink-secondary ring-1 ring-line ring-inset hover:ring-line-strong hover:text-ink",
        /** Non-interactive display pill. */
        readout: "bg-transparent font-mono text-ink-tertiary tabular",
      },
      size: {
        sm: "h-6 px-2 text-2xs [&_svg]:size-3",
        md: "h-7 px-2.5 text-sm [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface PillProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof pillVariants> {
  startIcon?: React.ReactNode;
  /** Renders a dismiss affordance. Requires `onDismiss`. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(function Pill(
  { className, variant, size, startIcon, onDismiss, dismissLabel, children, ...props },
  ref,
) {
  const nonInteractive = variant === "readout";

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={variant === "active" ? true : undefined}
      disabled={nonInteractive ? true : props.disabled}
      className={cn(
        pillVariants({ variant, size }),
        /* A readout is disabled for semantics but must not look faded. */
        nonInteractive && "disabled:cursor-default disabled:opacity-100",
        className,
      )}
      {...props}
    >
      {startIcon}
      {children}
      {onDismiss && (
        <span
          role="button"
          tabIndex={0}
          aria-label={dismissLabel ?? "Remove"}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onDismiss();
            }
          }}
          className="-mr-0.5 ml-0.5 grid size-4 place-items-center rounded-full hover:bg-ink/10"
        >
          <X className="size-3" />
        </span>
      )}
    </button>
  );
});

export { pillVariants };
