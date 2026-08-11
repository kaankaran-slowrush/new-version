"use client";

import * as React from "react";
import { CircleAlert } from "lucide-react";
import { Field as BaseField } from "@base-ui/react/field";
import type {
  FieldRootProps as BaseFieldRootProps,
  FieldLabelProps as BaseFieldLabelProps,
  FieldDescriptionProps as BaseFieldDescriptionProps,
  FieldErrorProps as BaseFieldErrorProps,
  FieldItemProps as BaseFieldItemProps,
} from "@base-ui/react/field";
import { cn } from "@/lib/cn";

/* =============================================================================
   Field — the label / description / error shell every control lives in.
   =============================================================================

   Follows the conventions set by `button.tsx`: `cn()` merges `className` last,
   `forwardRef` on every part, focus inherited from the global `:focus-visible`
   rule. There is no `cva` matrix here because a field has no variants — it has
   exactly one correct layout, and offering alternatives would only invite
   inconsistent forms.

   Two ways to use it:

     1. `<Field label=… description=… error=…>` — the composite. Handles ids,
        `aria-describedby`, and vertical rhythm for you.
     2. `<FieldRoot>` + `<FieldLabel>` + `<FieldDescription>` + `<FieldError>` —
        manual composition when a layout needs something unusual (a label on the
        same row as the control, a description that sits beside it, etc).

   UX NOTES
   --------
   • ORDER IS label → description → control → error, and that order is load
     bearing. A description is an *instruction* ("we'll never share this"), so it
     must be read before the user commits to typing. An error is a *reaction*, so
     it belongs where the eye lands after leaving the control. Putting help text
     below the input is the single most common form bug: users type first, then
     discover the rule they just broke.

   • ERROR IS NEVER COLOUR ALONE. `FieldError` always renders a `CircleAlert`
     glyph next to its text. Red text on a light ground is invisible to a red-green
     dichromat and to anyone on a washed-out projector; the icon plus the words
     carry the message, and colour is only the accelerant. This is also why the
     error is real text rather than a red outline on the control.

   • THE ERROR SLOT IS NOT RESERVED. It appears and pushes content down. The
     alternative — always reserving a line — adds a blank gap under every field
     in the form, which is a permanent tax paid to avoid one moment of movement.

   • LABELS ARE ALWAYS VISIBLE, never placeholder-only. A placeholder disappears
     the instant a user starts typing, exactly when they most want to re-check
     what the box is for, and it never survives autofill.

   • The composite passes control props via a render callback rather than cloning
     children. `Field` cannot know whether its child is our `<Input>` (a native
     element that needs `id` + `aria-describedby`) or a Base UI control that
     self-associates — so it hands the props over and lets the caller place them.
     Explicit beats magic, and it typechecks.

   • `required` is marked with an asterisk that is `aria-hidden`: the real signal
     for assistive tech is `required` on the control itself, which the render
     callback passes through. The asterisk is decoration for sighted scanning.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   Parts
   -------------------------------------------------------------------------- */

export interface FieldRootProps extends Omit<BaseFieldRootProps, "className"> {
  className?: string;
}

/** Groups one control with its label, description and error. Renders a `<div>`. */
export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(
  function FieldRoot({ className, ...props }, ref) {
    return (
      <BaseField.Root
        ref={ref}
        className={cn("flex w-full flex-col gap-1.5", className)}
        {...props}
      />
    );
  },
);

export interface FieldLabelProps
  extends Omit<BaseFieldLabelProps, "className"> {
  className?: string;
}

/** Renders a `<label>`, auto-associated with any Base UI control inside. */
export const FieldLabel = React.forwardRef<HTMLElement, FieldLabelProps>(
  function FieldLabel({ className, ...props }, ref) {
    return (
      <BaseField.Label
        ref={ref}
        className={cn(
          "flex items-center gap-1 text-sm font-medium text-ink select-none",
          "data-[disabled]:text-ink-muted",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface FieldDescriptionProps
  extends Omit<BaseFieldDescriptionProps, "className"> {
  className?: string;
}

/** Supporting instruction. Sits ABOVE the control — see UX NOTES. */
export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(function FieldDescription({ className, ...props }, ref) {
  return (
    <BaseField.Description
      ref={ref}
      className={cn(
        /* The block tier's support recipe. It was 12px, which made it the only
           support line in the kit at that size and left field hints noticeably
           quieter than every other explanation the product gives. */
        "text-sm text-ink-tertiary",
        "data-[disabled]:text-ink-muted",
        className,
      )}
      {...props}
    />
  );
});

export interface FieldErrorProps extends Omit<BaseFieldErrorProps, "className"> {
  className?: string;
}

/**
 * Validation message. Always icon + text, never colour alone.
 *
 * The icon is injected through Base UI's `render` prop rather than as a child so
 * that Base UI's own generated message (from `ValidityState`) still comes
 * through when no explicit children are passed.
 */
export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  function FieldError({ className, ...props }, ref) {
    return (
      <BaseField.Error
        ref={ref}
        className={cn(
          "flex items-start gap-1.5 text-xs text-danger",
          className,
        )}
        render={({ children, ...errorProps }) => (
          <div {...errorProps}>
            <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
            <span>{children}</span>
          </div>
        )}
        {...props}
      />
    );
  },
);

export interface FieldItemProps extends Omit<BaseFieldItemProps, "className"> {
  className?: string;
}

/**
 * A single row inside a checkbox or radio group: control on the left, label
 * (and optional description) on the right.
 *
 * `items-start` rather than `items-center` because a two-line label must keep
 * its box aligned to the FIRST line — vertically centring a control against a
 * wrapping label makes the box drift into the paragraph.
 */
export const FieldItem = React.forwardRef<HTMLDivElement, FieldItemProps>(
  function FieldItem({ className, ...props }, ref) {
    return (
      <BaseField.Item
        ref={ref}
        className={cn(
          "flex items-start gap-2.5 [&>label]:font-normal",
          className,
        )}
        {...props}
      />
    );
  },
);

/* -----------------------------------------------------------------------------
   Composite
   -------------------------------------------------------------------------- */

/**
 * The props `Field` hands to a native control. Spread them straight onto our
 * `<Input>` / `<Textarea>`:
 *
 * ```tsx
 * <Field label="Endpoint" error="Must be https">
 *   {(control) => <Input {...control} placeholder="https://…" />}
 * </Field>
 * ```
 */
export interface FieldControlRenderProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  invalid: boolean | undefined;
  required: boolean | undefined;
  disabled: boolean | undefined;
}

export interface FieldProps
  extends Omit<FieldRootProps, "children" | "invalid"> {
  /** Always render one. Placeholder-only labelling is not supported on purpose. */
  label?: React.ReactNode;
  /** Instruction shown between the label and the control. */
  description?: React.ReactNode;
  /**
   * Validation message. Passing this also marks the field invalid, so a caller
   * never has to keep `error` and `invalid` in sync.
   */
  error?: React.ReactNode;
  /** Marks the field invalid without showing a message. */
  invalid?: boolean;
  /** Draws the asterisk and passes `required` through to the control. */
  required?: boolean;
  children?:
    | React.ReactNode
    | ((control: FieldControlRenderProps) => React.ReactNode);
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(
    {
      className,
      label,
      description,
      error,
      invalid,
      required,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    const uid = React.useId();
    const controlId = `${uid}control`;
    const descriptionId = `${uid}description`;
    const errorId = `${uid}error`;

    const hasError = error !== undefined && error !== null && error !== false;
    const isInvalid = hasError || invalid === true;

    const describedBy =
      [description ? descriptionId : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    const control: FieldControlRenderProps = {
      id: controlId,
      "aria-describedby": describedBy,
      "aria-invalid": isInvalid || undefined,
      invalid: isInvalid || undefined,
      required,
      disabled,
    };

    return (
      <FieldRoot
        ref={ref}
        className={className}
        disabled={disabled}
        invalid={isInvalid}
        {...props}
      >
        {label ? (
          <FieldLabel htmlFor={controlId}>
            {label}
            {required ? (
              <span className="text-danger" aria-hidden>
                *
              </span>
            ) : null}
          </FieldLabel>
        ) : null}

        {description ? (
          <FieldDescription id={descriptionId}>{description}</FieldDescription>
        ) : null}

        {typeof children === "function" ? children(control) : children}

        {hasError ? (
          <FieldError id={errorId} match>
            {error}
          </FieldError>
        ) : null}
      </FieldRoot>
    );
  },
);
