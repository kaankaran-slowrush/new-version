/* =============================================================================
   The icon registry
   =============================================================================

   WHY THIS FILE EXISTS

   Before it, the modality map (text→Type, image→Image, video→Video, audio→Music)
   was re-declared in TEN places under SIX different names — MODES, MODALITY_ICON,
   MODALITY_META, CAPABILITY_ICON, ARTIFACT_ICON, CATEGORY_ICON — and the
   visibility map in three. That is not a tidiness problem. It meant:

     • Adding a fifth modality was a ten-file change with no compiler help.
     • The maps had already drifted: `session-list.tsx` set `text: null` while
       every other map rendered an icon, and `playground-view.tsx` listed the four
       modalities in a different order than `composer.tsx`, so the same product
       concept had two different reading orders on two screens.
     • One map hardcoded `size-3.5` inside the JSX, which defeated the parent's
       `[&_svg]:size-*` contract and silently broke sizing at every other call site
       that reused it.

   THE DESIGN DECISION THAT MAKES THIS WORK

   These maps store icon COMPONENTS, never rendered JSX elements. A stored
   `<Type />` is frozen: the consumer cannot size it, colour it, or hide it from
   assistive tech without prop-cloning. A stored `Type` is rendered by the call
   site, so the ambient `[&_svg]:size-*` rule from Button/Badge/Pill/Toolbar
   applies exactly as it does to a hand-written icon.

     const Icon = MODALITY_ICON[modality];
     return <Icon />;                       // inherits the parent's size + colour

   This file is `.ts`, not `.tsx`, and that is deliberate — it is what stops
   anyone from putting JSX back in.

   STROKE WEIGHT lives in CSS, not here: `svg[stroke-width]` in globals.css
   applies `--icon-stroke` to every icon at once. See the note there for why.
   ============================================================================= */

import {
  BookText,
  Bot,
  Circle,
  Clock,
  Cpu,
  GitBranch,
  LayoutGrid,
  Globe,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Music,
  SlidersHorizontal,
  Type,
  Users,
  Video,
  Wallet,
  Webhook,
  type LucideIcon,
} from "lucide-react";

import type { Modality } from "./mock/agents";
import type { RunCategory } from "./mock/platform";
import type { Visibility } from "./mock/sessions";

export type { LucideIcon };

/* -----------------------------------------------------------------------------
   Modality — the product's central concept
   -------------------------------------------------------------------------- */

/** THE canonical order. Text first because it is the cheapest and most common
    starting point, then the visual modalities by production cost. Import this
    rather than writing the four out, so every picker on every screen reads the
    same way round. */
export const MODALITIES: readonly Modality[] = ["text", "image", "video", "audio"];

export const MODALITY_ICON: Record<Modality, LucideIcon> = {
  text: Type,
  image: ImageIcon,
  video: Video,
  audio: Music,
};

export const MODALITY_LABEL: Record<Modality, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
};

/* -----------------------------------------------------------------------------
   Visibility — private / workspace / public
   -------------------------------------------------------------------------- */

export const VISIBILITY_ICON: Record<Visibility, LucideIcon> = {
  private: Lock,
  workspace: Users,
  public: Globe,
};

export const VISIBILITY_LABEL: Record<Visibility, string> = {
  private: "Private",
  workspace: "Workspace",
  public: "Public",
};

/** Badge tone per visibility. `public` is deliberately `warning`, not `success`:
    making a session public is the one irreversible-feeling choice in the set, and
    the badge should read as "be aware", not "well done". */
export const VISIBILITY_TONE: Record<Visibility, "neutral" | "accent" | "warning"> = {
  private: "neutral",
  workspace: "accent",
  public: "warning",
};

/* -----------------------------------------------------------------------------
   Run categories

   These are input→output pipelines, so the icon marks the OUTPUT modality — what
   you got, not what you gave it. "Image to Video" shows a video glyph, because
   when scanning a run list the question is always "which of these produced the
   thing I am looking for".
   -------------------------------------------------------------------------- */

export const CATEGORY_ICON: Record<RunCategory, LucideIcon> = {
  "Image to Image": ImageIcon,
  "Image to Video": Video,
  "Text to Video": Video,
  "Text to Image": ImageIcon,
  "Text to Speech": Music,
};

/* -----------------------------------------------------------------------------
   Navigation

   Keyed by href rather than label, because the href is the thing that is already
   unique and already the identity used for active-state matching. Keying by label
   would mean a copy change silently dropped the icon.
   -------------------------------------------------------------------------- */

/** The glyph for an href with no registry entry. Deliberately the most neutral
    shape in the set: a fallback should look like an unfilled slot, not like a
    meaningful icon someone chose. It used to be `Sparkles`, which meant a missing
    entry was indistinguishable from a real "AI" marker. */
export const NAV_ICON_FALLBACK: LucideIcon = Circle;

export const NAV_ICON: Record<string, LucideIcon> = {
  /* The three primary destinations. The topbar is icon-first, so these are no
     longer decoration beside a label — they ARE the control at rest, which is why
     they live in the registry rather than in the component.

     Agents was `Sparkles`, which had come to mean five unrelated things at once:
     this destination, the Account menu item, "Auto — recommended" on the models
     page, two buttons in the session canvas, AND the fallback for a missing
     registry entry. A glyph that means everything means nothing. `Bot` says
     "agent" with no interpretation required, which frees `Sparkles` to mean
     exactly one thing everywhere else — AI / automatic.

     Models was `Boxes`. `Cpu` is the more literal read for a catalogue of
     compute engines, and it does not collide with the stacked-cubes shape that
     already appears in workflow and grid contexts. */
  "/agents": Bot,
  "/workflows": GitBranch,
  "/models": Cpu,
  /* The Platform group's own trigger. */
  "/platform": LayoutGrid,
  "/playground": SlidersHorizontal,
  "/platform/run-history": Clock,
  /* Wallet, matching the topbar's balance chip. The chip and the menu item are the
     same destination, so they must be the same glyph — a CreditCard here and a
     Wallet there would read as two different places. */
  "/settings/billing": Wallet,
  "/platform/api-keys": KeyRound,
  "/platform/webhooks": Webhook,
  "/docs": BookText,
};
