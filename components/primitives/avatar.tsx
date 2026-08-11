import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   Avatar
   =============================================================================
   UX NOTES
   --------
   • Initials, not a generic person glyph. In a B2B tool most accounts never
     upload a photo, so the fallback IS the common case and should look
     deliberate rather than like a missing image.
   • `shape="square"` (rounded-lg) is for non-human subjects — agents, models,
     workspaces. Circles read as people; squares read as things. Keeping that
     distinction consistent means a user can tell what kind of entity a row is
     about before reading it.
   • Accent-tinted fill rather than a random per-user hue: this kit has one
     accent, and hashing names to colours produces a confetti sidebar and
     accidental contrast failures.
   ============================================================================= */

const avatarVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-semibold",
  {
    variants: {
      size: {
        xs: "size-6 text-2xs",
        sm: "size-7 text-2xs",
        md: "size-9 text-sm",
        lg: "size-11 text-base",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
      },
      tone: {
        accent: "bg-accent-soft text-accent-ink",
        solid: "bg-accent text-accent-text",
        ink: "bg-ink text-canvas",
        muted: "bg-surface-sunken text-ink-secondary",
      },
    },
    defaultVariants: { size: "md", shape: "circle", tone: "accent" },
  },
);

export interface AvatarProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children">,
    VariantProps<typeof avatarVariants> {
  /** Full name / label — used for the accessible name and to derive initials. */
  name: string;
  /** Override the derived initials (e.g. a single-letter monogram). */
  initials?: string;
  src?: string;
}

function deriveInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar({ className, size, shape, tone, name, initials, src, ...props }, ref) {
    return (
      <span
        ref={ref}
        role="img"
        aria-label={name}
        className={cn(avatarVariants({ size, shape, tone }), className)}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden>{initials ?? deriveInitials(name)}</span>
        )}
      </span>
    );
  },
);

export { avatarVariants };
