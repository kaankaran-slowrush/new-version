"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import type {
  DialogBackdropProps,
  DialogDescriptionProps,
  DialogPopupProps,
  DialogPortalProps,
  DialogTitleProps,
} from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Dialog — a modal surface that takes over the page.
   =============================================================================

   Base UI parts: Root · Trigger · Portal · Backdrop · Viewport · Popup · Title ·
   Description · Close. `DialogContent` composes Portal + Backdrop + Viewport +
   Popup into one element so a caller writes three tags, not seven, and cannot
   forget the backdrop (a modal without one is a floating card with no context).

   UX NOTES
   --------
   • OPAQUE, never glass. Glass is reserved for persistent navigational chrome
     (topbar, rails, composer) where there is a known ambient ground to refract.
     A dialog sits over *arbitrary* content — a translucent one puts the page's
     text directly behind the dialog's text, which is unreadable at any blur.
   • The backdrop is `bg-ink/35` + a 2px blur. The tint alone would let a busy
     page keep competing for attention; the blur alone would keep it bright. The
     pair pushes the page one layer back without hiding where you were.
   • Modals are the ONE exception to this kit's origin-aware entry rule. Menus
     and popovers scale from their trigger because they *belong* to it; a modal
     belongs to the whole viewport, so it scales from its own center. Giving it
     a directional origin would imply a spatial relationship that isn't there.
   • Entry is `--duration-slow` (320ms), the top of the dialog band. Slower than
     a menu on purpose: a dialog interrupts, and an interruption that appears
     instantly reads as an error state rather than a deliberate stop.
   • Scrolling lives on the Viewport, not the Popup, so a tall dialog scrolls
     the popup *within* the viewport instead of clipping its own rounded corners
     and shadow.
   • `showClose` draws the X. Keep it on for anything non-destructive: an
     explicit exit is the difference between "I can back out" and "I'm trapped".
     Base UI also requires a Close inside the Popup so touch screen readers can
     escape a modal.
   ============================================================================= */

const dialogPopupVariants = cva(
  [
    "relative m-auto flex w-full flex-col",
    /* `bg-surface-solid`, not `bg-surface`, and `panel-edge`, which this was the
       only overlay missing. Both for the same reason: the plane is legible because
       --backdrop-cap imposes a worst case behind it, and NOTHING imposes anything
       behind a dialog. It lands over content, over generated media, over whatever
       the route happens to be showing. So it occludes rather than tints, and it
       draws its own boundary rather than relying on a fill that is not there. */
    "panel-edge rounded-3xl bg-surface-solid text-ink shadow-md",
    "p-6 outline-none",
    /* Modals stay centered — see UX NOTES. No `origin-(--transform-origin)`. */
    "origin-center",
    "transition-[opacity,scale] duration-(--duration-slow) ease-(--ease-out-quint)",
    "data-starting-style:scale-[0.97] data-starting-style:opacity-0",
    "data-ending-style:scale-[0.97] data-ending-style:opacity-0",
  ],
  {
    variants: {
      /* Widths, not heights. A dialog's height should always be its content's;
         a fixed height either strands whitespace or invents a scrollbar. */
      size: {
        sm: "max-w-[26rem]", // confirmations, single question
        md: "max-w-[34rem]", // the default: a short form
        lg: "max-w-[46rem]", // two-column content, previews
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface DialogContentProps
  extends Omit<DialogPopupProps, "className">,
    VariantProps<typeof dialogPopupVariants> {
  className?: string;
  /** Escape hatch for the backdrop, e.g. a heavier tint over media. */
  backdropClassName?: string;
  /** Escape hatch for the scrollable viewport that centers the popup. */
  viewportClassName?: string;
  /** Renders the X affordance in the top-right corner. @default true */
  showClose?: boolean;
  /** Accessible name for the X button. @default "Close dialog" */
  closeLabel?: string;
  /** Forwarded to `Dialog.Portal` — render into a container other than body. */
  container?: DialogPortalProps["container"];
  /** Forwarded to `Dialog.Portal`. Keeps the DOM alive while closed. */
  keepMounted?: boolean;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    {
      className,
      backdropClassName,
      viewportClassName,
      size,
      showClose = true,
      closeLabel = "Close dialog",
      container,
      keepMounted,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Dialog.Portal container={container} keepMounted={keepMounted}>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-(--z-dialog) min-h-dvh",
            /* `--color-scrim-dialog`, and it was `bg-ink/35` — which on this ground meant a
       NEAR-WHITE 35% wash over the whole viewport, because `ink` is near-white
       here. Every modal in the product bleached the page behind it. A scrim's job
       is to push the page back; this one was pulling it forward.

       No `backdrop-blur-[2px]` either. That was a full-viewport compositor pass
       blurring a field the plane has already blurred at 40px — the most expensive
       no-op available. The scrim's own opacity does the separating instead. */
    "bg-scrim-dialog",
            "transition-opacity duration-(--duration-slow) ease-(--ease-out-quint)",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
            backdropClassName,
          )}
        />
        <Dialog.Viewport
          className={cn(
            "fixed inset-0 z-(--z-dialog) flex items-center justify-center",
            "overflow-y-auto overscroll-contain p-4 sm:p-6",
            viewportClassName,
          )}
        >
          <Dialog.Popup
            ref={ref}
            className={cn(dialogPopupVariants({ size }), className)}
            {...props}
          >
            {children}
            {showClose && (
              <Dialog.Close
                aria-label={closeLabel}
                className={cn(
                  "absolute top-4 right-4 grid size-8 place-items-center rounded-md",
                  "text-ink-tertiary",
                  "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
                  "hover:bg-surface-hover hover:text-ink",
                )}
              >
                <X className="size-4" />
              </Dialog.Close>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    );
  },
);

export interface DialogTitleComponentProps
  extends Omit<DialogTitleProps, "className"> {
  className?: string;
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleComponentProps>(
  function DialogTitle({ className, ...props }, ref) {
    return (
      <Dialog.Title
        ref={ref}
        /* pr-10 keeps the title clear of the X so a long one does not run
           underneath it. */
        className={cn("pr-10 text-lg font-semibold text-ink", className)}
        {...props}
      />
    );
  },
);

export interface DialogDescriptionComponentProps
  extends Omit<DialogDescriptionProps, "className"> {
  className?: string;
}

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionComponentProps
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <Dialog.Description
      ref={ref}
      className={cn(
          "mt-1.5 text-sm leading-relaxed text-ink-secondary",
          className,
        )}
      {...props}
    />
  );
});

export interface DialogFooterProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Stacks actions full-width. Use on narrow/`sm` dialogs where two side-by-side
   * buttons would each be too small to hit comfortably.
   */
  stacked?: boolean;
}

/**
 * Not a Base UI part — a layout slot. Actions are right-aligned because the
 * confirming action should land where the eye finishes reading, and reversed in
 * DOM order is a common a11y bug, so keep Cancel first in source.
 */
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, stacked = false, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "mt-6 flex gap-2",
          stacked
            ? "flex-col-reverse [&>*]:w-full"
            : "flex-row items-center justify-end",
          className,
        )}
        {...props}
      />
    );
  },
);

/* Unstyled pass-throughs. Re-exported rather than wrapped so the generic
   `payload`/`handle` typing and the `render` prop survive intact — a caller
   composes them with Button via `render={<Button />}`. */
const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogClose = Dialog.Close;
const DialogBackdrop = Dialog.Backdrop;
const DialogPortal = Dialog.Portal;
const DialogViewport = Dialog.Viewport;

export type DialogBackdropComponentProps = DialogBackdropProps;

export {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogBackdrop,
  DialogPortal,
  DialogViewport,
  dialogPopupVariants,
};
