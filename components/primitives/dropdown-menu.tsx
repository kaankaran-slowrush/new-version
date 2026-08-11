"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import type {
  MenuGroupLabelProps,
  MenuItemProps,
  MenuPopupProps,
  MenuPositionerProps,
} from "@base-ui/react/menu";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   DropdownMenu — a transient list of actions anchored to its trigger.
   =============================================================================

   Base UI parts: Root · Trigger · Portal · Positioner · Popup · Item ·
   LinkItem · Group · GroupLabel · Separator. `DropdownMenuContent` composes
   Portal + Positioner + Popup, because those three always travel together and
   the z-index belongs on the Positioner (the element that is actually placed),
   which is easy to get wrong by hand.

   UX NOTES
   --------
   • OPAQUE `bg-surface` + `shadow-md`. A menu appears over unknown content —
     translucency would put the page's text behind the menu's labels. Glass is
     for chrome that lives in a known place over a known ground.
   • ORIGIN-AWARE ENTRY. Base UI computes `--transform-origin` from the resolved
     side, and exposes `data-[side]` / `data-[align]`. The popup scales from the
     trigger's edge and slides 4px *away* from it, so the menu reads as unfolding
     out of the button rather than materialising nearby. When collision handling
     flips the menu above the trigger, the motion flips with it for free.
   • 160ms (`--duration-fast`). A menu is a step in a gesture already in flight —
     the pointer is moving toward the first item before the menu has landed.
     Anything slower and the user out-runs their own UI.
   • Items respond to `data-highlighted`, not `:hover`. Base UI unifies pointer
     hover and keyboard roving focus into that one attribute, so a keyboard user
     sees exactly the state a mouse user sees. `hover:` is kept as a companion
     for the case where a consumer sets `highlightItemOnHover={false}`.
   • A destructive item is `text-ink-secondary` at REST like its neighbours, and
     only turns `bg-danger-soft text-danger-ink` when highlighted. Red at rest in a
     list of six items is six alarms; red on approach is a warning you receive at
     the moment it is useful.
   • Items are 2.5 units of padding tall (~38px) rather than the 44px control
     floor: a menu is a burst of related choices where scanning distance matters
     more than individual target size, and the whole row is the hit area.
   • The MEGA variant is for navigation, not actions — icon tile + title +
     description. Use it when the user is choosing *where to go* and needs to
     know what each destination is. Never mix mega and plain rows in one menu:
     the description makes plain rows look unfinished.
   ============================================================================= */

/* Shared by both variants. Origin-aware entry lives here. */
const menuPopupBase = [
  "min-w-[var(--anchor-width)] max-h-[var(--available-height)] overflow-y-auto",
  "panel-edge rounded-2xl bg-surface shadow-md outline-none",
  "origin-(--transform-origin)",
  "transition-[opacity,scale,translate]",
  "duration-(--duration-fast) ease-(--ease-out-quint)",
  "data-starting-style:opacity-0 data-starting-style:scale-[0.96]",
  "data-ending-style:opacity-0 data-ending-style:scale-[0.96]",
  /* Directional nudge. Every class is literal so Tailwind's scanner sees it. */
  "data-[side=bottom]:data-starting-style:-translate-y-1",
  "data-[side=bottom]:data-ending-style:-translate-y-1",
  "data-[side=top]:data-starting-style:translate-y-1",
  "data-[side=top]:data-ending-style:translate-y-1",
  "data-[side=left]:data-starting-style:translate-x-1",
  "data-[side=left]:data-ending-style:translate-x-1",
  "data-[side=right]:data-starting-style:-translate-x-1",
  "data-[side=right]:data-ending-style:-translate-x-1",
  "data-[side=inline-start]:data-starting-style:translate-x-1",
  "data-[side=inline-start]:data-ending-style:translate-x-1",
  "data-[side=inline-end]:data-starting-style:-translate-x-1",
  "data-[side=inline-end]:data-ending-style:-translate-x-1",
  /* Base UI sets data-instant when the change must not animate (re-open on a
     sibling trigger, dismissal). Honour it or the menu appears to lag. */
  "data-instant:transition-none",
];

const menuPopupVariants = cva(menuPopupBase, {
  variants: {
    variant: {
      /* Dense action list. */
      default: "w-max p-1.5",
      /* Navigational panel: wider, roomier, rows carry a description. */
      mega: "w-max min-w-[21rem] max-w-[26rem] p-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface DropdownMenuContentProps
  extends Omit<MenuPopupProps, "className">,
    VariantProps<typeof menuPopupVariants> {
  className?: string;
  /** Which side of the trigger to open on. @default "bottom" */
  side?: MenuPositionerProps["side"];
  /** Alignment along that side. @default "start" */
  align?: MenuPositionerProps["align"];
  /** Gap between trigger and menu, in px. @default 6 */
  sideOffset?: MenuPositionerProps["sideOffset"];
  /** Offset along the alignment axis, in px. */
  alignOffset?: MenuPositionerProps["alignOffset"];
  /** Escape hatch for the positioner element. */
  positionerClassName?: string;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  {
    className,
    positionerClassName,
    variant,
    /* `start` rather than `center`: a menu's left edge should line up with its
       trigger's left edge, or the eye has to re-find the column of labels. */
    align = "start",
    side = "bottom",
    sideOffset = 6,
    alignOffset,
    ...props
  },
  ref,
) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn("z-(--z-dropdown) outline-none", positionerClassName)}
      >
        <Menu.Popup
          ref={ref}
          className={cn(menuPopupVariants({ variant }), className)}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
});

const menuItemVariants = cva(
  [
    "flex w-full cursor-default items-center gap-2.5 rounded-sm",
    "px-2.5 py-2.5 text-sm text-ink-secondary",
    "select-none outline-none",
    "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
    "data-disabled:pointer-events-none data-disabled:text-ink-muted",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "data-highlighted:bg-surface-hover data-highlighted:text-ink",
          "hover:bg-surface-hover hover:text-ink",
        ],
        /* Red arrives on approach, not at rest. See UX NOTES. */
        destructive: [
          "data-highlighted:bg-danger-soft data-highlighted:text-danger-ink",
          "hover:bg-danger-soft hover:text-danger-ink",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface DropdownMenuItemProps
  extends Omit<MenuItemProps, "className">,
    VariantProps<typeof menuItemVariants> {
  className?: string;
  /** Trailing slot: a shortcut hint, a chevron, a count. */
  endSlot?: React.ReactNode;
}

const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { className, variant, endSlot, children, ...props },
    ref,
  ) {
    return (
      <Menu.Item
        ref={ref}
        className={cn(menuItemVariants({ variant }), className)}
        {...props}
      >
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {endSlot && (
          <span className="shrink-0 text-xs text-ink-tertiary">{endSlot}</span>
        )}
      </Menu.Item>
    );
  },
);

export interface DropdownMenuMegaItemProps
  extends Omit<MenuItemProps, "className" | "title"> {
  className?: string;
  /** Goes in the 38px tile. Sized to 18px automatically. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** One line. If it needs two, the destination needs a better name. */
  description?: React.ReactNode;
}

/**
 * A navigational row: 38px accent tile, 16px/500 title, 13px tertiary
 * description. The tile is `bg-accent-soft` (a 10% wash, not a solid fill) so a
 * column of six does not turn the menu into a stripe of brand colour.
 */
const DropdownMenuMegaItem = React.forwardRef<
  HTMLElement,
  DropdownMenuMegaItemProps
>(function DropdownMenuMegaItem(
  { className, icon, title, description, ...props },
  ref,
) {
  return (
    <Menu.Item
      ref={ref}
      className={cn(
        "flex w-full cursor-default items-start gap-3 rounded-sm p-2.5",
        "select-none outline-none",
        "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
        "data-highlighted:bg-surface-hover hover:bg-surface-hover",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden
          className={cn(
            "grid size-[38px] shrink-0 place-items-center rounded-md",
            "bg-accent-soft text-accent-ink",
            "[&_svg]:size-4.5",
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium text-ink">
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-tertiary">
            {description}
          </span>
        )}
      </span>
    </Menu.Item>
  );
});

export interface DropdownMenuLabelProps
  extends Omit<MenuGroupLabelProps, "className"> {
  className?: string;
}

/**
 * A group heading. Uppercase 11px: it must read as a *label* at a glance so it
 * is never mistaken for a disabled item, which is the classic failure here.
 */
const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...props }, ref) {
    return (
      <Menu.GroupLabel
        ref={ref}
        className={cn(
          "eyebrow px-2.5 pt-2 pb-1",
          "text-ink-tertiary select-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface DropdownMenuSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Menu.Separator>, "className"> {
  className?: string;
}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <Menu.Separator
      ref={ref}
      /* Inset by the item radius so the rule stops where the hover fill does. */
      className={cn("mx-1.5 my-1.5 h-px bg-line", className)}
      {...props}
    />
  );
});

/* Unstyled pass-throughs — keeps generic payload typing and `render` intact. */
const DropdownMenuRoot = Menu.Root;
const DropdownMenuTrigger = Menu.Trigger;
const DropdownMenuGroup = Menu.Group;
const DropdownMenuPortal = Menu.Portal;
const DropdownMenuPositioner = Menu.Positioner;
const DropdownMenuSubmenuRoot = Menu.SubmenuRoot;
const DropdownMenuSubmenuTrigger = Menu.SubmenuTrigger;

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuMegaItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSubmenuRoot,
  DropdownMenuSubmenuTrigger,
  menuPopupVariants,
  menuItemVariants,
};
