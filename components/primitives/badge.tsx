import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Badge
   =============================================================================
   A non-interactive label. If it can be clicked, you want Pill instead.

   UX NOTES
   --------
   • Badges carry *state or category*, never actions. A clickable badge is a
     confusing affordance: capsule shapes read as either "tag" or "button" and
     the only thing disambiguating them is whether hovering does something.
   • Semantic variants use the soft tints, not solid fills. A row of solid
     coloured badges in a table turns the page into a traffic light and destroys
     the scan — the tint is enough to read as state while staying quiet.
   • For status specifically, prefer StatusMark (which pairs colour with shape).
     Use a semantic Badge when the label text is doing the work and the colour
     is only reinforcement.
   ============================================================================= */

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-surface-sunken text-ink-secondary",
        accent: "bg-accent-soft text-accent-ink",
        success: "bg-success-soft text-success-ink",
        warning: "bg-warning-soft text-warning-ink",
        danger: "bg-danger-soft text-danger-ink",
        outline: "bg-transparent text-ink-secondary ring-1 ring-line-strong ring-inset",
      },
      size: {
        sm: "px-1.5 py-0.5 text-2xs [&_svg]:size-2.5",
        md: "px-2 py-0.5 text-xs [&_svg]:size-3",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, size, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
});

export { badgeVariants };
