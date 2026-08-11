"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Textarea — multi-line text control that grows with its content.
   =============================================================================

   Same conventions as `button.tsx` / `input.tsx`: `cva` for the size × state
   matrix, `className` merged LAST, `forwardRef` to the real `<textarea>`, focus
   inherited (hoisted to the wrapper, as in `input.tsx`).

   UX NOTES
   --------
   • AUTO-GROW, WITH A CEILING. A fixed-height textarea forces the user to scroll
     inside a 3-line porthole while composing; an unbounded one lets a long answer
     push the submit button off-screen. So it starts at one line, grows to fit,
     and stops at `maxHeight` (default 12rem ≈ 8 lines) where it becomes a normal
     scroller. The two failure modes are bounded from both ends.

   • FLOOR OF 52px (`--control-height-xl`). Below that a textarea is
     indistinguishable from a single-line input, and users type one line and stop.
     The floor is the *promise of room* — it is what tells you a paragraph is
     welcome here. It comes from the shared control scale, not a magic number.

   • THE RESIZE HANDLE IS REMOVED while auto-growing (`resize-none`). Leaving it
     means the browser writes an inline height on first drag and auto-grow dies
     silently afterwards. With `autoGrow={false}` the handle comes back, because
     then manual resize is the only sizing the control has.

   • A WELL, NOT A CARD — `bg-surface-sunken`, no lift. Identical reasoning to
     `input.tsx`: recessed means "content goes in here".

   • INVALID IS NEVER COLOUR ALONE. The red edge is joined by a `CircleAlert`
     glyph on its own row at the bottom-right *inside* the box. Bottom-right
     rather than overlaid on the text, because a floating marker either covers
     the user's words or forces a padding change that reflows the text at the
     exact moment they are reading it.

   • Growth is not animated. Height easing lags the caret, and a caret that
     arrives before its line does feels broken rather than smooth.
   ============================================================================= */

const textareaVariants = cva(
  [
    "relative flex w-full cursor-text flex-col",
    "min-h-(--control-height-xl)",
    "bg-surface-sunken text-ink",
    "border border-transparent",
    "transition-[background-color,border-color,color]",
    "duration-(--duration-fast) ease-(--ease-out-quint)",
    /* Same recipe as the global :focus-visible rule, hoisted to the wrapper. */
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid",
    "has-[:focus-visible]:outline-accent has-[:focus-visible]:outline-offset-2",
    "[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "gap-1 rounded-md px-2.5 py-1.5 text-sm [&_svg]:size-3.5",
        md: "gap-1 rounded-lg px-3 py-2 text-sm [&_svg]:size-4",
        lg: "gap-1.5 rounded-lg px-3.5 py-2.5 text-base [&_svg]:size-4",
      },
      invalid: {
        true: "border-danger",
        false: "hover:border-line",
      },
      disabled: {
        true: "cursor-not-allowed bg-surface text-ink-muted",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

export interface TextareaProps
  extends Omit<React.ComponentPropsWithoutRef<"textarea">, "size" | "rows">,
    Omit<VariantProps<typeof textareaVariants>, "disabled"> {
  /**
   * Grow to fit content up to `maxHeight`. Turn it off to get a plain,
   * user-resizable textarea.
   * @default true
   */
  autoGrow?: boolean;
  /**
   * Ceiling for the growth, as any CSS length. Past it the control scrolls.
   * @default "12rem"
   */
  maxHeight?: number | string;
  /**
   * Styles the wrapper — the box that *looks* like the control. Use
   * `textareaClassName` to reach the `<textarea>` element itself.
   */
  className?: string;
  /** Escape hatch for the inner `<textarea>`. */
  textareaClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      textareaClassName,
      size,
      invalid,
      disabled,
      autoGrow = true,
      maxHeight = "12rem",
      style,
      onInput,
      value,
      defaultValue,
      ...props
    },
    forwardedRef,
  ) {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    /* Measure-then-set. `height: auto` first so `scrollHeight` reports the
       content height rather than the height we assigned on the previous pass. */
    const fit = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) {
        return;
      }
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoGrow]);

    /* Runs for controlled updates, uncontrolled first paint, and programmatic
       value changes alike — anything that can alter the rendered line count. */
    React.useLayoutEffect(fit, [fit, value, defaultValue, maxHeight]);

    /* A narrower box re-wraps the same text into more lines. Width-guarded so
       our own height writes cannot re-trigger the observer. */
    React.useEffect(() => {
      const el = innerRef.current;
      if (!el || !autoGrow || typeof ResizeObserver === "undefined") {
        return;
      }
      let lastWidth = el.clientWidth;
      const observer = new ResizeObserver(() => {
        if (el.clientWidth !== lastWidth) {
          lastWidth = el.clientWidth;
          fit();
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [autoGrow, fit]);

    return (
      <span
        className={cn(
          textareaVariants({
            size,
            invalid: invalid ?? false,
            disabled: disabled ? true : undefined,
          }),
          className,
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
      >
        <textarea
          ref={setRef}
          rows={1}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          value={value}
          defaultValue={defaultValue}
          onInput={(event) => {
            fit();
            onInput?.(event);
          }}
          style={{ maxHeight, ...style }}
          className={cn(
            "w-full min-w-0 appearance-none bg-transparent text-inherit",
            "placeholder:text-ink-muted",
            /* The ring lives on the wrapper — see UX NOTES. */
            "outline-none focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:text-ink-muted",
            autoGrow ? "resize-none overflow-y-auto" : "resize-y",
            textareaClassName,
          )}
          {...props}
        />

        {invalid ? (
          <span className="flex justify-end text-danger" aria-hidden>
            <CircleAlert />
          </span>
        ) : null}
      </span>
    );
  },
);

export { textareaVariants };
