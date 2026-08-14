"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Input — single-line text control.
   =============================================================================

   Conventions inherited from `button.tsx`: `cva` for the size × state matrix,
   `className` merged LAST via `cn`, `forwardRef` to the real `<input>`, and no
   locally invented focus ring.

   UX NOTES
   --------
   • AN INPUT IS A WELL, NOT A CARD. It is filled with `bg-surface-sunken` and
     carries no lift. Every raised surface in this kit means "this is an object
     you can act on"; an input means "put something in here". Inverting that —
     the white-card-with-a-border input — makes a form read as a stack of
     buttons, and the eye stops being able to tell the two apart at a glance.

   • THE FOCUS RING BELONGS TO THE WRAPPER, NOT THE INPUT. Because the icon slots
     live outside the `<input>`, the element that receives focus is smaller than
     the thing that looks like the control. So the inner input's own outline is
     suppressed and the wrapper draws it via `has-[:focus-visible]` — reusing the
     exact treatment from the global `:focus-visible` rule (2px accent, 2px
     offset) rather than inventing a second focus language. `has-[:focus-visible]`
     and not `focus-within`, so a mouse click does not paint a keyboard ring.

   • INVALID IS NEVER COLOUR ALONE. A red border is the accelerant; the carrier
     is the `CircleAlert` glyph auto-placed in the trailing slot (suppressed if
     the caller already supplied an `endIcon`, since two trailing marks read as
     noise) plus the message that `<Field>` renders underneath. Border colour on
     its own is invisible to a dichromat and vanishes entirely on a low-contrast
     display.

   • DISABLED LOSES THE WELL. It flips to flat `bg-surface`: the recess is the
     affordance that says "content goes in", so removing it says "not now" before
     the cursor even changes. Expressed in fill, text colour AND cursor — never
     one of the three.

   • HOVER PROMOTES THE EDGE (`border-transparent` → `border-line`) rather than
     shifting the fill. A field that changes colour under the pointer draws the
     eye away from wherever the user is actually typing.

   • Radius and height track `button.tsx` exactly (`rounded-md` at sm/md,
     `rounded-lg` at lg, heights from `--control-height-*`) so an input and a
     button sitting in the same row agree on their corners and baseline.
   ============================================================================= */

const inputVariants = cva(
  [
    "relative flex w-full items-center",
    "bg-surface-sunken text-ink",
    /* A transparent border so hover/invalid can colour it without reflowing. */
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
        sm: "h-(--control-height-sm) gap-1.5 rounded-md px-3 text-sm [&_svg]:size-3.5",
        md: "h-(--control-height-md) gap-2 rounded-md px-3.5 text-sm [&_svg]:size-4",
        lg: "h-(--control-height-lg) gap-2 rounded-lg px-4 text-base [&_svg]:size-4",
      },
      invalid: {
        true: "border-danger",
        false: "hover:border-line",
      },
      disabled: {
        /* `surface-disabled`, which is `transparent`. The affordance of an input
           is its recess, so disabling it removes the well — but with a RAISED card
           tier, painting `bg-surface` here would make a disabled control brighter
           than an enabled one. Flat means flat. */
        true: "cursor-not-allowed bg-surface-disabled text-ink-muted",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size">,
    Omit<VariantProps<typeof inputVariants>, "disabled"> {
  /** Leading slot — an icon, a currency mark, a protocol prefix. */
  startIcon?: React.ReactNode;
  /** Trailing slot. Replaces the automatic invalid glyph when provided. */
  endIcon?: React.ReactNode;
  /**
   * Styles the wrapper — the box that *looks* like the control. Use
   * `inputClassName` to reach the `<input>` element itself.
   */
  className?: string;
  /** Escape hatch for the inner `<input>` (text alignment, tabular nums, …). */
  inputClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      inputClassName,
      size,
      invalid,
      startIcon,
      endIcon,
      disabled,
      ...props
    },
    ref,
  ) {
    /* Invalid with no caller-supplied trailing slot gets the alert glyph, so the
       state is legible without reading the colour. */
    const endSlot = endIcon ?? (invalid ? <CircleAlert aria-hidden /> : null);

    return (
      <span
        className={cn(
          inputVariants({
            size,
            invalid: invalid ?? false,
            disabled: disabled ? true : undefined,
          }),
          className,
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
      >
        {startIcon ? (
          <span
            className={cn(
              "flex shrink-0 items-center",
              disabled ? "text-ink-muted" : "text-ink-tertiary",
            )}
            aria-hidden
          >
            {startIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-full w-full min-w-0 appearance-none bg-transparent text-inherit",
            "placeholder:text-ink-muted",
            /* The ring lives on the wrapper — see UX NOTES. */
            "outline-none focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:text-ink-muted",
            inputClassName,
          )}
          {...props}
        />

        {endSlot ? (
          <span
            className={cn(
              "flex shrink-0 items-center",
              disabled
                ? "text-ink-muted"
                : invalid && !endIcon
                  ? "text-danger"
                  : "text-ink-tertiary",
            )}
            aria-hidden
          >
            {endSlot}
          </span>
        ) : null}
      </span>
    );
  },
);

export { inputVariants };
