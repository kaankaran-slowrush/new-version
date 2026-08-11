"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   ThemeToggle — light ⇄ dim
   =============================================================================

   TWO THEMES, NOT THREE, AND NO "SYSTEM". A system option sounds generous and is
   the reason theme toggles are confusing: the control then has three states, two
   of which look identical most of the time, and the user cannot tell whether the
   page is light because they chose light or because their OS did. The kit's dim
   theme is a deliberate design, not an accessibility fallback, so it is chosen
   rather than inherited.

   `prefers-color-scheme` is deliberately NOT consulted for the same reason. If a
   consuming product wants to seed the first visit from the OS, that is one line in
   the inline script in layout.tsx — and it should be a product decision, made once,
   not a third state in this control.

   ---------------------------------------------------------------------------
   WHY THE STATE LIVES ON <html> AND NOT IN REACT. The attribute is the source of
   truth, written by a blocking script before first paint (see layout.tsx). If this
   component owned the state, the server would render light, hydration would swap
   to dim, and every dim-theme user would see a white flash on every navigation —
   the single most common bug in theme switchers. So this reads the DOM on mount
   rather than initialising from a prop, and `suppressHydrationWarning` on <html>
   covers the one attribute the server cannot know.

   THE ICON SHOWS THE DESTINATION, NOT THE CURRENT STATE. A sun while you are in
   light mode is a label; a moon while you are in light mode is a button. Toggles
   that show the current state make the user work out what pressing them does, and
   they get it wrong about half the time. `aria-label` says it in words so the
   affordance does not rest on the metaphor alone.
   ============================================================================= */

export type Theme = "light" | "dim";

export const THEME_STORAGE_KEY = "model-store-theme";

export function ThemeToggle({ className }: { className?: string }) {
  /* Starts as null — "not yet known". Rendering an icon before the DOM has been
     read would mean guessing, and a toggle that flips to the correct glyph a frame
     after mount looks broken. */
  const [theme, setTheme] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dim" ? "dim" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dim" ? "light" : "dim";
    setTheme(next);
    /* `light` is written explicitly rather than removing the attribute, so the
       stored preference and the DOM always say the same thing. An absent attribute
       and `light` render identically but read differently. */
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Private mode, or storage disabled. The toggle still works for this
         session; it just will not be remembered. Not worth surfacing. */
    }
  };

  const goingDim = theme !== "dim";

  return (
    <button
      type="button"
      onClick={toggle}
      /* Not aria-pressed: this is not a thing being switched on, it is a choice
         between two named states, and the label carries which one is next. */
      aria-label={goingDim ? "Switch to the dim theme" : "Switch to the light theme"}
      className={cn(
        /* Square, and the same height as the nav pills either side of it — it is a
           control in the same row, so it takes the control token rather than a
           number that happened to match when it was written. */
        "grid size-(--control-height-md) shrink-0 place-items-center rounded-full",
        "text-ink-secondary transition-colors duration-(--duration-fast)",
        "hover:bg-surface-hover hover:text-ink",
        "[&_svg]:size-4",
        className,
      )}
    >
      {/* Both glyphs are always mounted and one is hidden, so the button never
          changes size between themes — a toggle that shifts the row it sits in is
          how a topbar ends up reflowing on every press. `theme === null` renders
          neither, for the one frame before the DOM has been read. */}
      {theme === null ? null : goingDim ? <Moon /> : <Sun />}
    </button>
  );
}
