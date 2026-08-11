"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookText,
  ChevronDown,
  LogOut,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { NAV_ICON, NAV_ICON_FALLBACK } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import {
  Avatar,
  Badge,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuMegaItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives";
import { MeterBar } from "@/components/patterns";
import { ThemeToggle } from "./theme-toggle";
import { PLATFORM_NAV, PRIMARY_NAV } from "@/lib/nav";
import { BALANCE } from "@/lib/mock/models";
import { WORKSPACE } from "@/lib/mock/sessions";
import { Wordmark } from "@/components/chrome/wordmark";
import { useScrolled } from "@/lib/use-scrolled";
import { cn } from "@/lib/cn";

/* =============================================================================
   TopNav — a compact centred island that opens on hover
   =============================================================================

   THE SHAPE. It is not a bar. It is a small pill, only as wide as its contents,
   centred at the top of the viewport. A full-width bar spends the entire top edge
   of every screen on five links and an avatar; this spends about 320px on them
   and gives the rest of that edge back to the page. On a product whose surfaces
   are already floating and translucent, a welded band across the top is the one
   element that would look bolted on.

   ICON-FIRST, LABEL ON HOVER — for DESTINATIONS ONLY. The wordmark and the
   balance figure never collapse; see the note on what stays visible, below. Each
   destination is a glyph at rest and grows its label when the pill is hovered.
   The labels are always in the DOM — collapsed with `max-width: 0` and
   `overflow: hidden`, never `display: none` — so screen readers and keyboard users
   get the full name at all times. This is the same technique the session rails use.

   THE ACTIVE ITEM KEEPS ITS LABEL, ALWAYS. This is the fix for icon-only
   navigation's real failure, which is not "what does this glyph mean" but "where
   am I". One label is visible at rest and it is the one that answers that.

   WHY THE WHOLE PILL EXPANDS, NOT THE HOVERED ITEM. Per-item expansion is the
   obvious reading of "expand on hover" and it is a usability trap: expanding one
   item pushes its neighbours sideways, so aiming at the next one means chasing a
   moving target — the same failure as macOS dock magnification. Hovering anywhere
   opens every label at once; the pill grows a single time, then nothing moves
   while you travel along it.

   IT GROWS FROM THE CENTRE. `w-fit` + `mx-auto` means the expansion is symmetric
   rather than shoving everything rightward, which is what makes it read as the
   object breathing open rather than as a layout reflow.

   ADAPTIVE GLASS. Fully transparent until content scrolls under it — glass with
   nothing behind it is separating itself from nothing. See the `[data-lifted]`
   rules in globals.css; only this element opts in.

   WHAT STAYS VISIBLE AT REST, AND WHY THAT LIST IS SHORT.
   • The balance figure. It is a PERSISTENT READOUT, not a menu item: for a
     metered product the operator needs to glance at spend, and it is the reason a
     generation gets blocked. Collapsing it behind a wallet glyph would be the one
     genuinely wrong compaction here.
   • The active destination's label.
   • The WORDMARK — mark and name both. See components/chrome/wordmark.tsx.
   • The workspace SWITCHER moved into the avatar menu, which already owned a
     "Switch workspace" section. Nothing was removed — two adjacent controls that
     both opened workspace things became one.
   ============================================================================= */

/* The shared open/close transition. Extracted because six elements use it and a
   drift between any two of them reads as the pill coming apart mid-animation. */
const REVEAL =
  "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-(--duration-normal) ease-(--ease-out-quint)";

export function TopNav() {
  const pathname = usePathname();
  /* 16px. The pill's bottom edge sits at 68px (16 inset + 52 height) and page
     content starts at 96px, so the glass has finished arriving well before the
     first pixel of content passes underneath. */
  const lifted = useScrolled(16);
  const remainingPct = Math.min(
    100,
    Math.round((BALANCE.remaining / (BALANCE.allowance || 1)) * 100 * 100) / 100,
  );
  const platformActive = pathname.startsWith("/platform") || pathname.startsWith("/playground");

  return (
    <nav
      aria-label="Main"
      data-lifted={lifted}
      className={cn(
        "glass group fixed inset-x-0 top-(--nav-inset) z-(--z-nav) mx-auto w-fit",
        "flex h-(--nav-height) max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full px-2",
      )}
    >
      {/* ---- Wordmark: the mark plus the name, both always visible.
              The destinations may compact to glyphs — they are recoverable on
              hover and the active one keeps its label — but the product's own name
              is not a destination, and a bar that never says which product you are
              in is disorienting on a first visit and anonymous after. ---- */}
      <Wordmark className="px-2" />

      <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-line-inner" />

      {/* ---- Destinations ---- */}
      {PRIMARY_NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-(--control-height-md) shrink-0 items-center rounded-full px-3 text-sm font-medium",
              "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
              "[&_svg]:size-4",
              active
                ? "bg-surface-active text-ink"
                : "text-ink-secondary hover:bg-surface-hover hover:text-ink",
            )}
          >
            <Icon of={NAV_ICON[item.href] ?? NAV_ICON_FALLBACK} />
            <span
              className={cn(
                REVEAL,
                /* The current section is the one label that never collapses.
                   Padding lives INSIDE the clipped span so the gap collapses with
                   it — a margin would survive `max-width: 0` and leave a hole. */
                active
                  ? "max-w-32 opacity-100"
                  : "max-w-0 opacity-0 group-hover:max-w-32 group-hover:opacity-100",
              )}
            >
              <span className="block ps-2">{item.label}</span>
            </span>
          </Link>
        );
      })}

      {/* ---- Platform: the same treatment, but it opens a menu ---- */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger
          className={cn(
            "flex h-(--control-height-md) shrink-0 items-center rounded-full px-3 text-sm font-medium",
            "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
            "[&_svg]:size-4",
            platformActive
              ? "bg-surface-active text-ink"
              : "text-ink-secondary hover:bg-surface-hover hover:text-ink",
            "data-popup-open:bg-surface-hover data-popup-open:text-ink",
          )}
        >
          <Icon of={NAV_ICON["/platform"] ?? NAV_ICON_FALLBACK} />
          <span
            className={cn(
              REVEAL,
              platformActive
                ? "max-w-32 opacity-100"
                : "max-w-0 opacity-0 group-hover:max-w-32 group-hover:opacity-100",
            )}
          >
            <span className="flex items-center gap-1 ps-2">
              Platform
              <ChevronDown className="size-3.5 opacity-60" />
            </span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent variant="mega">
          {/* Driven by PLATFORM_NAV (the IA) plus NAV_ICON (the registry), so
              adding a platform route is a one-file change and the menu cannot
              drift from the information architecture. */}
          {PLATFORM_NAV.map((item) => (
            <DropdownMenuMegaItem
              key={item.href}
              icon={<Icon of={NAV_ICON[item.href] ?? NAV_ICON_FALLBACK} />}
              title={item.label}
              description={item.description}
              render={<Link href={item.href} />}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-line-inner" />

      {/* ---- Balance: the one readout that must survive compaction ---- */}
      <Link
        href="/settings/billing"
        className={cn(
          "flex h-(--control-height-md) shrink-0 items-center gap-2 rounded-full px-3",
          "transition-colors duration-(--duration-fast)",
          "hover:bg-surface-hover [&_svg]:size-3.5",
        )}
      >
        <Wallet className="text-ink-secondary" />
        <span className="tabular font-mono text-sm text-ink">
          ${BALANCE.remaining.toFixed(2)}
        </span>
        {/* The meter is the part that can afford to be conditional: the figure
            answers "how much", the bar answers "how much of the allowance", and
            only the first is urgent enough to hold space at rest. */}
        <span
          className={cn(
            REVEAL,
            "max-w-0 opacity-0 group-hover:max-w-16 group-hover:opacity-100",
          )}
        >
          <span className="block ps-0.5">
            <MeterBar
              value={remainingPct}
              tone={remainingPct < 10 ? "warning" : "accent"}
              className="w-10"
              aria-label="Balance remaining"
            />
          </span>
        </span>
      </Link>

      {/* Between the balance and the avatar on purpose: it is chrome-level state
          like they are, and it is the one control here that changes nothing about
          the workspace — so it does not belong inside the account menu, where every
          other item is a destination or an action. */}
      <ThemeToggle />

      {/* ---- Account. The workspace switcher lives in here now. ---- */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger
          aria-label="Account and workspace menu"
          className="shrink-0 rounded-full transition-opacity duration-(--duration-fast) hover:opacity-85"
        >
          <Avatar
            name={WORKSPACE.user.name}
            initials={WORKSPACE.user.initials}
            size="sm"
            tone="ink"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-60">
          <div className="flex items-center gap-3 p-2">
            <Avatar
              name={WORKSPACE.user.name}
              initials={WORKSPACE.user.initials}
              size="lg"
              tone="accent"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {WORKSPACE.user.name}
              </p>
              <p className="text-xs text-ink-tertiary">{WORKSPACE.user.role}</p>
            </div>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem render={<Link href="/settings/workspace" />}>
            <Users />
            Workspace settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
          <DropdownMenuItem>
            <Avatar
              name={WORKSPACE.name}
              initials={WORKSPACE.initial}
              size="xs"
              shape="square"
              tone="solid"
            />
            {WORKSPACE.name}
            <Badge variant="warning" size="sm" className="ml-auto">
              {WORKSPACE.role}
            </Badge>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/settings/account" />}>
            <UserRound />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/docs" />}>
            <BookText />
            Docs
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" render={<Link href="/login" />}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </nav>
  );
}
