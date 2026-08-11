import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/button";

/* =============================================================================
   EmptyState — what a section looks like before it has anything in it.
   =============================================================================

   UX NOTES
   --------
   • AN EMPTY LIST RENDERED UNDER A HEADER READS AS BROKEN. "Recent Runs"
     followed by nothing is indistinguishable from "Recent Runs" followed by a
     failed fetch, and the user's first instinct is to reload. So there are only
     two acceptable treatments for a section with no rows:
       1. OMIT THE SECTION ENTIRELY — best when the section is not the point of
          the page. A dashboard should not be a museum of things you have not
          done yet; ten empty cards is a worse first run than four full ones.
       2. RENDER THIS — when the absence is itself information ("you have no API
          keys yet") or when the empty state is the natural place to offer the
          action that fills it.
     Never a header over a void.
   • The glyph is a container with a hairline, not a giant illustration. It marks
     the spot the content will appear in without pretending to be content, and it
     is `ink-muted` so it never competes with the title.
   • ONE line of body copy. Two paragraphs in an empty state is a confession that
     the feature needs explaining — put that in docs and keep this to the single
     sentence that tells the user what will be here.
   • Copy rule: describe what WILL be here, not what is missing. "Your generated
     images will appear here" beats "No images found" — the first is a promise,
     the second is a dead end.
   • Three ink levels: title `ink`, body `ink-secondary`, and the optional
     footnote `ink-muted`. Flattening title and body into the same grey removes
     the only reading order this block has.
   • The action is `primary` because in an empty state there is nothing else on
     screen for it to compete with — this is the one context where a filled
     button inside a card body is correct.
   ============================================================================= */

const emptyStateVariants = cva(
  ["flex flex-col items-center text-center", "mx-auto"],
  {
    variants: {
      size: {
        /* Inside a card or a rail — no big vertical hole in a dense layout. */
        sm: "max-w-xs gap-2 px-4 py-8",
        md: "max-w-sm gap-3 px-6 py-12",
        /* A whole page or route with nothing in it yet. */
        lg: "max-w-md gap-4 px-6 py-20",
      },
      /* Opt-in dashed well for a drop target or a placeholder slot. Concentric:
         one rung below a Card's `rounded-2xl`. */
      framed: {
        true: "rounded-xl border border-dashed border-line-strong bg-surface-sunken/60",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const glyphVariants = cva(
  [
    "grid shrink-0 place-items-center rounded-xl",
    "bg-surface-sunken text-ink-tertiary shadow-xs",
    "[&_svg]:size-5",
  ],
  {
    variants: {
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10",
        lg: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const titleVariants = cva(["font-semibold text-ink"], {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: { size: "md" },
});

export interface EmptyStateProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title">,
    VariantProps<typeof emptyStateVariants> {
  /** Defaults to an inbox glyph. Pass a lucide icon element to be specific. */
  icon?: React.ReactNode;
  /** Set to `false` to drop the glyph in very tight placements. */
  showIcon?: boolean;
  title: React.ReactNode;
  /**
   * Outline level. Defaults to `h3`. Drop to `"p"` only where the empty state is
   * repeated per row in a list — N identical headings would pollute the outline
   * rather than help anyone navigate it.
   */
  as?: "h2" | "h3" | "h4" | "p";
  /** ONE sentence. Say what will be here, not what is missing. */
  description?: React.ReactNode;
  /** Label for the primary action. Omit both action props for a mute state. */
  actionLabel?: React.ReactNode;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Escape hatch: a fully custom action row (two buttons, a link, a menu). */
  action?: React.ReactNode;
  /** Lowest-priority footnote under the action — a docs hint, a shortcut. */
  footnote?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      className,
      size,
      framed,
      icon,
      showIcon = true,
      title,
      as: Tag = "h3",
      description,
      actionLabel,
      onAction,
      action,
      footnote,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, framed }), className)}
        {...props}
      >
        {showIcon ? (
          <span className={glyphVariants({ size })} aria-hidden>
            {icon ?? <Inbox strokeWidth={1.75} />}
          </span>
        ) : null}

        <div className="flex flex-col gap-1">
          {/* A HEADING, not a <p>. It was a <p> for a long time, which meant an
              empty state never appeared in the document outline and never got
              `text-wrap: balance` — a real loss on the two-line titles this
              component exists to show. Safe to promote precisely because the
              block tier is sans: an h3 picks up no display serif here. */}
          <Tag className={titleVariants({ size })}>{title}</Tag>
          {description ? (
            /* Deliberately `ink-secondary` rather than the block tier's
               `ink-tertiary`. An empty state's line is the only instruction on
               screen — it is prose the reader must actually act on, not metadata
               they may skip. The one sanctioned exception to the tier's ink. */
            <p className="text-sm text-ink-secondary">{description}</p>
          ) : null}
        </div>

        {action ??
          (actionLabel ? (
            <Button
              variant="primary"
              size={size === "sm" ? "sm" : "md"}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          ) : null)}

        {footnote ? (
          <p className="text-2xs text-ink-tertiary">{footnote}</p>
        ) : null}
      </div>
    );
  },
);

export { emptyStateVariants };
