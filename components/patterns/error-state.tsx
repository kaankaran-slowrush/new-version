import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/button";
import { headerTitleVariants } from "./section-header";

/* =============================================================================
   ErrorState — something failed, and here is the way out.
   =============================================================================

   UX NOTES
   --------
   • DESIGN THE RECOVERY PATH BEFORE THE HAPPY PATH. The happy path is the case
     where the interface barely matters — everything worked. The failure is where
     the user is stuck, tense, and deciding whether this product is reliable. If
     you cannot say what the two ways out of a state are, that state is not
     designed yet, no matter how good the success case looks.
   • THEREFORE: ALWAYS TWO ACTIONS, and both are required props here so the API
     cannot express a dead end.
       – PRIMARY: retry. The failure is often transient and retrying is free.
       – SECONDARY: go back / edit the input. Because retrying an identical bad
         request forever is not recovery, and a user with only a "Retry" button
         and a broken prompt has no move left.
   • DANGER IS A LEFT-EDGE ACCENT BAR PLUS AN ICON — NEVER A FULL RED WASH. A
     red-filled panel does three bad things: it drops text contrast, it makes
     every error feel catastrophic so real catastrophes have nowhere left to
     escalate to, and it turns a recoverable hiccup into an alarm. A 3px danger
     rail on a normal surface is unmistakable at a glance and still comfortable
     to read (the rail here is 4px — one step on the spacing scale, not an
     arbitrary hairline). The optional `tint` is `--color-danger-soft` at 8% — a
     whisper, and it is opt-in.
   • The message must be HONEST AND SPECIFIC. "Something went wrong" tells the
     user nothing and implies nobody instrumented this path. "The model timed out
     after 30s" tells them whether to retry, wait, or change the request. Put the
     machine-readable part in `detail` (mono, `ink-tertiary`) so it can be
     screenshotted into a support thread without dominating the message.
   • The triangle glyph matches StatusMark's `error` shape, so "failed" looks the
     same whether it is 12px in a table row or a full panel here. Shape, not just
     color — this survives greyscale and colorblindness.
   • Three ink levels: title `ink`, message `ink-secondary`, detail
     `ink-tertiary`. The danger color is spent on the rail and the icon only, so
     it stays a signal rather than a mood.
   ============================================================================= */

const errorStateVariants = cva(
  [
    "relative overflow-hidden",
    /* The rail. `before` rather than `border-l` so it is a deliberate accent
       with its own inset, not a box edge that implies a border on all sides. */
    "before:absolute before:inset-y-0 before:left-0 before:w-1",
    "before:bg-danger before:content-['']",
  ],
  {
    variants: {
      /* Concentric: `xl` sits one rung inside a Card's `2xl`; `2xl` is for the
         standalone case where this IS the card. */
      size: {
        sm: "rounded-lg py-3 pr-4 pl-4 text-sm",
        md: "rounded-xl p-5 pl-6",
        lg: "rounded-2xl p-6 pl-7",
      },
      surface: {
        /* Default: a normal opaque surface. The rail does the signalling. */
        surface: "panel-edge bg-surface shadow-sm",
        /* Inside a card that already provides the surface. */
        plain: "bg-transparent",
        /* Opt-in 8% wash. Only when the error must be found in a long page. */
        tint: "bg-danger-soft",
      },
    },
    defaultVariants: { size: "md", surface: "surface" },
  },
);

export interface ErrorStateProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title">,
    VariantProps<typeof errorStateVariants> {
  /** Short and specific. "Generation failed", not "Error". */
  title: React.ReactNode;
  /**
   * Outline level. Defaults to `h3`. Drop to `"p"` where the error is rendered
   * once per item in a list — see EmptyState for the same trade.
   */
  as?: "h2" | "h3" | "h4" | "p";
  /**
   * One or two sentences of honest explanation: what failed, and what it means
   * for the user. Never "something went wrong".
   */
  message: React.ReactNode;
  /** Machine detail — request id, status code, timeout. Rendered mono. */
  detail?: React.ReactNode;
  /** REQUIRED primary recovery. Defaults to a "Try again" label. */
  onRetry: React.MouseEventHandler<HTMLButtonElement>;
  retryLabel?: React.ReactNode;
  /**
   * REQUIRED secondary recovery — edit the input, go back, pick another model.
   * Retry alone is not a recovery path when the request itself is the problem.
   */
  onSecondary: React.MouseEventHandler<HTMLButtonElement>;
  secondaryLabel?: React.ReactNode;
  /** Swap the triangle for a more specific glyph (offline, rate limit). */
  icon?: React.ReactNode;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  function ErrorState(
    {
      className,
      size,
      surface,
      title,
      as: Tag = "h3",
      message,
      detail,
      onRetry,
      retryLabel = "Try again",
      onSecondary,
      secondaryLabel = "Edit and resend",
      icon,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(errorStateVariants({ size, surface }), className)}
        {...props}
      >
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-danger" aria-hidden>
            {icon ?? <TriangleAlert className="size-4" strokeWidth={2.25} />}
          </span>

          <div className="min-w-0 flex-1">
            {/* A HEADING, not a <p> — same reasoning as EmptyState. The block
                tier is sans, so promoting it costs nothing visually and buys the
                outline entry and `text-wrap: balance`. `as="p"` is the escape
                hatch for a per-row error inside a list. */}
            <Tag className={cn(headerTitleVariants({ level: "block" }), "text-sm")}>
              {title}
            </Tag>
            <p className="mt-1 text-sm text-ink-secondary">{message}</p>

            {detail ? (
              /* Its own scroll container: a long request id or stack line must
                 not widen the panel or push the page sideways. */
              <p className="mt-2 overflow-x-auto font-mono text-2xs whitespace-nowrap text-ink-tertiary">
                {detail}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onRetry}
                startIcon={<RefreshCw aria-hidden />}
              >
                {retryLabel}
              </Button>
              <Button variant="ghost" size="sm" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export { errorStateVariants };
