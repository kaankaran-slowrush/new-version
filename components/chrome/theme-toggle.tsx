"use client";

import * as React from "react";
import { Layers, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   ThemeToggle — light → dim → spatial → light
   =============================================================================

   THREE THEMES, AND STILL NO "SYSTEM". A system option sounds generous and is the
   reason theme toggles are confusing: the control gains a state that looks
   identical to another one most of the time, and the user cannot tell whether the
   page is light because they chose light or because their OS did. All three themes
   here are deliberate designs rather than accessibility fallbacks, so all three are
   chosen rather than inherited.

   `prefers-color-scheme` is deliberately NOT consulted for the same reason. If a
   consuming product wants to seed the first visit from the OS, that is one line in
   the inline script in layout.tsx — and it should be a product decision, made once,
   not a fourth state in this control.

   ---------------------------------------------------------------------------
   WHY A CYCLE AND NOT A MENU. Three is the largest number of states a cycle can
   carry honestly: the user can reach any theme in at most two presses, and each
   press has a visible, immediate result they can reverse by continuing. At four it
   stops being a cycle and becomes a guessing game, and the answer is then a menu
   with named options — not a button pressed repeatedly. If a fourth theme is ever
   added, this control has to change shape, not just gain a glyph.

   THE ORDER IS BY GROUND, NOT BY DATE ADDED: light, then dim, then spatial. Each
   press takes you further from paper. `spatial` sits last because it is the most
   opinionated of the three — the one with a photograph in it — so a user cycling
   idly passes through the two conventional themes before arriving somewhere
   distinctive, rather than being dropped there first.

   WHY THE STATE LIVES ON <html> AND NOT IN REACT. The attribute is the source of
   truth, written by a blocking script before first paint (see layout.tsx). If this
   component owned the state, the server would render light, hydration would swap to
   the stored theme, and every non-light user would see a white flash on every
   navigation — the single most common bug in theme switchers. So this reads the DOM
   on mount rather than initialising from a prop, and `suppressHydrationWarning` on
   <html> covers the one attribute the server cannot know.

   THE ICON SHOWS THE DESTINATION, NOT THE CURRENT STATE. A sun while you are in
   light mode is a label; a moon while you are in light mode is a button. Toggles
   that show the current state make the user work out what pressing them does, and
   they get it wrong about half the time. `aria-label` says it in words so the
   affordance never rests on the metaphor alone — which matters more with three
   states than it did with two, because the metaphor is now carrying an order as
   well as a destination.

   `Layers` FOR SPATIAL, and it took some looking. `Sparkles` would have been
   decoration rather than description, and `Aperture` reads as camera settings.
   Layers is literally what the theme is: a plane in front of something else.
   ============================================================================= */

export type Theme = "light" | "dim" | "spatial";

export const THEME_STORAGE_KEY = "model-store-theme";

/* The cycle, and the single place its order is written. The inline script in
   layout.tsx validates against the same three names — if a theme is added it has
   to be added in both places, which is why both carry a pointer to the other. */
export const THEMES: readonly Theme[] = ["light", "dim", "spatial"] as const;

const NEXT_LABEL: Record<Theme, string> = {
  light: "Switch to the light theme",
  dim: "Switch to the dim theme",
  spatial: "Switch to the spatial theme",
};

const NEXT_ICON: Record<Theme, React.ReactNode> = {
  light: <Sun />,
  dim: <Moon />,
  spatial: <Layers />,
};

export function ThemeToggle({ className }: { className?: string }) {
  /* Starts as null — "not yet known". Rendering an icon before the DOM has been
     read would mean guessing, and a toggle that flips to the correct glyph a frame
     after mount looks broken. */
  const [theme, setTheme] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme | undefined;
    setTheme(current && THEMES.includes(current) ? current : "light");
  }, []);

  const next: Theme =
    theme === null ? "dim" : THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

  const cycle = () => {
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

  return (
    <button
      type="button"
      onClick={cycle}
      /* Not aria-pressed: this is not a thing being switched on, it is a cycle
         through named states, and the label carries which one is next. */
      aria-label={NEXT_LABEL[next]}
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
      {/* One glyph at a time, all the same size, so the button never changes
          dimensions between themes — a toggle that shifts the row it sits in is how
          a topbar ends up reflowing on every press. `theme === null` renders
          nothing, for the one frame before the DOM has been read. */}
      {theme === null ? null : NEXT_ICON[next]}
    </button>
  );
}
