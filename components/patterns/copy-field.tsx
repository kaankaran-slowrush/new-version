import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/button";

/* =============================================================================
   CopyField — a value whose only job is to be copied.
   =============================================================================

   API keys, share links, webhook endpoints, request ids.

   Presentational only: `onCopy` is a callback, `copied` is a prop. No clipboard
   write happens here, so the component stays server-safe and the success state
   stays owned by whoever actually performed the copy.

   UX NOTES
   --------
   • A READONLY `<input>`, NOT A `<div>`. It is focusable, selectable with the
     keyboard, and scrollable when the value overflows — so the value can still
     be retrieved by hand when the clipboard API is unavailable (insecure origin,
     locked-down browser). A div with `user-select` and no tab stop looks the same
     and quietly strips that fallback.
   • MONO, ALWAYS. `l` vs `1` vs `I` and `0` vs `O` are the entire content of an
     API key. A proportional font here is a support ticket waiting to happen.
   • THE BOX IS BORDERED AND SUNKEN — the input language, not the button
     language. It should read as "a value lives here", not "press me"; the one
     pressable thing in the row is the copy button, and it must be visually
     unambiguous which of the two is the action.
   • `masked` shows a dotted placeholder instead of the real value. Secrets on
     screen get shoulder-surfed and screen-shared; a key that is only revealed on
     purpose is the safer default for anything shown after creation.
   • Three ink levels: `label` at `ink-tertiary` (uppercase tracked field name), the
     value at `ink` (the payload), `hint` at `ink-muted` (created date, scope).
   • The copy button sits INSIDE the bordered row, flush right, sharing the
     row's height. A copy button floating outside the field reads as unrelated
     and gives the row two competing right edges.
   ============================================================================= */

const copyFieldRowVariants = cva(
  [
    "flex w-full min-w-0 items-center gap-1",
    "bg-surface-sunken shadow-xs",
    "transition-shadow duration-(--duration-fast) ease-(--ease-out-quint)",
  ],
  {
    variants: {
      /* Concentric: `lg` is the input rung and steps down inside a Card. */
      size: {
        sm: "h-(--control-height-sm) rounded-md pr-1 pl-3",
        md: "h-(--control-height-md) rounded-md pr-1 pl-3.5",
        lg: "h-(--control-height-lg) rounded-lg pr-1.5 pl-4",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const valueVariants = cva(
  [
    /* `bg-transparent` + no border: the row owns the chrome, not the input.
       Note there is NO `outline-none` here — the global `:focus-visible` rule is
       the only focus treatment in this kit, and killing the outline locally
       would leave a keyboard user with no indication they are in the field. */
    "min-w-0 flex-1 cursor-text truncate bg-transparent font-mono text-ink",
  ],
  {
    variants: {
      size: {
        sm: "text-2xs",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface CopyFieldProps
  extends Omit<
      React.ComponentPropsWithoutRef<"div">,
      "children" | "onCopy" | "defaultValue"
    >,
    VariantProps<typeof copyFieldRowVariants> {
  /** The value. Shown verbatim unless `masked`. */
  value: string;
  /** Uppercase tracked field name above the row. */
  label?: React.ReactNode;
  /** Lowest-priority meta under the row: "created 12 Jun", "read-only scope". */
  hint?: React.ReactNode;
  /** Hide the value behind dots. Reveal is the caller's decision. */
  masked?: boolean;
  /** Visual only — you own the clipboard write. */
  onCopy?: React.MouseEventHandler<HTMLButtonElement>;
  /** Flip to true after a successful copy to swap the icon to a check. */
  copied?: boolean;
  /** Extra control before the copy button — a reveal toggle, a regenerate menu. */
  adornment?: React.ReactNode;
  /** Accessible name for the input when there is no visible `label`. */
  "aria-label"?: string;
}

export const CopyField = React.forwardRef<HTMLInputElement, CopyFieldProps>(
  function CopyField(
    {
      className,
      size = "md",
      value,
      label,
      hint,
      masked = false,
      onCopy,
      copied = false,
      adornment,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    /* A fixed-length mask: dot count must NOT leak the real key length. */
    const shown = masked ? "••••••••••••••••••••••••" : value;

    return (
      <div className={cn("w-full min-w-0", className)} {...props}>
        {label ? (
          <p className="mb-1.5 eyebrow text-ink-tertiary">
            {label}
          </p>
        ) : null}

        <div className={copyFieldRowVariants({ size })}>
          <input
            ref={ref}
            readOnly
            value={shown}
            aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
            spellCheck={false}
            autoComplete="off"
            className={valueVariants({ size })}
          />

          {adornment}

          {onCopy ? (
            <Button
              variant="ghost"
              size={size === "lg" ? "md" : "sm"}
              iconOnly
              onClick={onCopy}
              aria-label={copied ? "Copied" : "Copy value"}
            >
              {copied ? (
                <Check className="text-success" aria-hidden />
              ) : (
                <Copy aria-hidden />
              )}
            </Button>
          ) : null}
        </div>

        {hint ? <p className="mt-1.5 text-2xs text-ink-tertiary">{hint}</p> : null}
      </div>
    );
  },
);

export { copyFieldRowVariants };
