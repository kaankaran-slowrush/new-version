import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/button";

/* =============================================================================
   CodeBlock — a snippet, on a sunken surface, that scrolls itself.
   =============================================================================

   Presentational only. No highlighting, no clipboard write, no state: `onCopy`
   is a callback the caller wires up, and `copied` is a prop the caller flips.
   That keeps this file server-safe and keeps the "did it work?" truth with
   whoever actually owns the clipboard call.

   UX NOTES
   --------
   • THE `<pre>` OWNS ITS OWN `overflow-x-auto`. Long lines are the normal case
     in code — a curl command with headers, a 300-char JWT. If the block itself
     does not scroll, the page body does, and then the nav, the sidebar and every
     other section slide off-screen to read one argument. The scroll container is
     the `<pre>`, and `min-w-0` on the wrapper stops a flex/grid parent from
     letting it push its column wider instead of scrolling.
   • SUNKEN, NOT RAISED. `bg-surface-sunken` says "this is inert content you read
     or copy", where `bg-surface` + shadow says "this is an object in the UI".
     Code is not a control.
   • The filename header is a hairline-separated strip, not a floating label. It
     carries the file path at `ink-tertiary` and the language at `ink-muted` —
     both below the code's own `ink`, because the code is what you came for.
   • `wrap` exists for prose-ish content (a long error message, a prompt) where
     horizontal scrolling is worse than reflowing. It is off by default because
     wrapping real code breaks its indentation cues.
   • The copy button is icon-only with a required accessible name, and swaps to a
     check when `copied` — a copy action with no visible receipt makes people
     click it three times.
   • `maxHeight` clamps very long snippets so a 400-line file does not become the
     page. Vertical scroll inside the block, again never the page.
   ============================================================================= */

const codeBlockVariants = cva(
  ["min-w-0 overflow-hidden bg-surface-sunken text-ink"],
  {
    variants: {
      /* Concentric: `lg` for a block nested inside a Card's `2xl`, `xl` when it
         sits directly on the canvas. Never `2xl` — it would match its parent. */
      radius: {
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      bordered: {
        true: "shadow-xs",
      },
      size: {
        sm: "text-2xs",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: { radius: "lg", bordered: true, size: "md" },
  },
);

export interface CodeBlockProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "onCopy">,
    VariantProps<typeof codeBlockVariants> {
  /** The snippet. Pass a string — this component does not highlight. */
  code: string;
  /** Shows the header strip with a path or file name. */
  filename?: React.ReactNode;
  /** Display-only language tag in the header, e.g. "bash", "ts". */
  language?: string;
  /** Renders the copy button. Visual only — you own the clipboard write. */
  onCopy?: React.MouseEventHandler<HTMLButtonElement>;
  /** Flip to true after a successful copy to swap the icon to a check. */
  copied?: boolean;
  /** Soft-wrap instead of scrolling. Off by default — it breaks indentation. */
  wrap?: boolean;
  /** Clamp height and scroll inside, e.g. "20rem". */
  maxHeight?: string;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
    {
      className,
      radius,
      bordered,
      size,
      code,
      filename,
      language,
      onCopy,
      copied = false,
      wrap = false,
      maxHeight,
      ...props
    },
    ref,
  ) {
    const showHeader = Boolean(filename || language || onCopy);

    return (
      <div
        ref={ref}
        className={cn(codeBlockVariants({ radius, bordered, size }), className)}
        {...props}
      >
        {showHeader ? (
          <div className="flex items-center justify-between gap-3 border-b border-line-inner px-3 py-1.5">
            <span className="min-w-0 truncate font-mono text-2xs text-ink-tertiary">
              {filename}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              {language ? (
                <span className="eyebrow text-ink-tertiary">
                  {language}
                </span>
              ) : null}
              {onCopy ? (
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={onCopy}
                  aria-label={copied ? "Copied" : "Copy code"}
                  className="-mr-1.5"
                >
                  {copied ? (
                    <Check className="text-success" aria-hidden />
                  ) : (
                    <Copy aria-hidden />
                  )}
                </Button>
              ) : null}
            </span>
          </div>
        ) : null}

        {/* The scroll boundary. Both axes are bounded here so the page never is. */}
        <pre
          className={cn(
            "overflow-x-auto overscroll-x-contain px-3 py-2.5",
            "font-mono leading-relaxed",
            wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
            maxHeight && "overflow-y-auto",
          )}
          style={maxHeight ? { maxHeight } : undefined}
          tabIndex={0}
        >
          <code>{code}</code>
        </pre>
      </div>
    );
  },
);

export { codeBlockVariants };
