"use client";

import * as React from "react";
import { ArrowUp, Settings2, Square, TriangleAlert } from "lucide-react";
import { MODALITIES, MODALITY_ICON, MODALITY_LABEL } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import { Button, Pill, SegmentedControl, Textarea } from "@/components/primitives";
import type { Modality } from "@/lib/mock/agents";
import { defaultModelFor, modelsFor, BALANCE } from "@/lib/mock/models";
import { cn } from "@/lib/cn";

/* =============================================================================
   Composer — three-tier progressive disclosure
   =============================================================================
   UX NOTES
   --------
   The problem this solves: a multi-modal composer needs mode tabs, per-mode
   controls (aspect, duration, voice), a model override, a cost estimate, an
   in-flight status banner, and a balance warning. Showing all of that at rest
   is a wall of text under a text box, and it makes the one thing you actually
   came to do — type — the least prominent element on screen.

   So it discloses in three tiers:

     1 · REST      Mode glyph + input + send. Nothing else. This is what most
                   glances need, and it keeps the artifact above it dominant.
     2 · HOVER /   The panel lifts (translateY) and reveals mode tabs plus any
         FOCUS     active status banners. These matter when you are *about to
                   type*, not before.
     3 · CLICK     The settings toggle pins per-mode controls open, and they stay
                   until dismissed. Hover would be wrong here: these are values
                   you adjust deliberately, and a row that vanishes when the
                   pointer drifts is unusable.

   Other decisions worth keeping when porting:

   • THE SEND BUTTON IS NOT A STOP BUTTON. An earlier revision overloaded it, so
     switching mode tabs mid-generation left a Stop icon attached to a composer
     that was ready for the *next* prompt — it read as a bug. In-flight state now
     lives in its own banner with its own Stop, tied to the generation actually
     running. One control, one job.

   • COST IS SHOWN BEFORE COMMITTING, and an unaffordable generation is blocked
     at the button with an explanation — never accepted and then failed. Model
     choice and cost are wired together, because picking Sora 2 over Auto is a
     5× price change and hiding that would be a trap.

   • MODEL OVERRIDE DEFAULTS TO AUTO. This is a model marketplace, so which model
     ran is legitimately interesting — but making it a required decision before
     every prompt would tax the common case. Opt-in, not mandatory.
   ============================================================================= */

/* Derived from the registry, so the four modalities appear in the same order and
   with the same glyphs on every screen that offers this choice. */
const MODES = MODALITIES.map((value) => ({
  value,
  label: MODALITY_LABEL[value],
  icon: <Icon of={MODALITY_ICON[value]} />,
}));

const PLACEHOLDER: Record<Modality, string> = {
  text: "Ask anything, or describe the copy you need…",
  image: "Describe the image you want to generate…",
  video: "Describe the video you want to generate…",
  audio: "Describe the voiceover you want…",
};

export interface ComposerProps {
  /** In-flight generation, if any. Drives the status banner — independent of the
      mode selected for the NEXT prompt. */
  generating?: { modality: Modality; etaLabel: string } | null;
  onStop?: () => void;
}

export function Composer({ generating, onStop }: ComposerProps) {
  const [mode, setMode] = React.useState<Modality>("video");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [modelId, setModelId] = React.useState(() => defaultModelFor("video").id);
  const [value, setValue] = React.useState("");

  const models = modelsFor(mode);
  const selected = models.find((m) => m.id === modelId) ?? defaultModelFor(mode);
  const cost = selected.pricePerRun;
  const affordable = cost <= BALANCE.remaining;
  const canSend = value.trim().length > 0 && affordable;

  /* Switching mode must reset the model, or you end up "using" an image model in
     video mode and the cost estimate lies. */
  function changeMode(next: Modality) {
    setMode(next);
    setModelId(defaultModelFor(next).id);
  }

  const activeIcon = MODES.find((m) => m.value === mode)?.icon;

  return (
    <div className="group/composer px-6 pb-6">
      <div
        className={cn(
          "glass mx-auto max-w-(--canvas-max-width) overflow-hidden rounded-3xl",
          "translate-y-2 transition-transform duration-(--duration-slow) ease-(--ease-out-quint)",
          "group-hover/composer:translate-y-0 focus-within:translate-y-0",
          settingsOpen && "translate-y-0",
        )}
        style={{ boxShadow: "var(--shadow-composer)" }}
      >
        {/* ---- Tier 2: in-flight status. Its own banner, its own Stop. ---- */}
        {generating && (
          <div className="anim-fade-in mx-3 mt-3 flex items-center gap-2.5 rounded-xl bg-accent-soft px-3 py-2">
            <span className="anim-soft-pulse size-2 shrink-0 rounded-full bg-accent" />
            <p className="flex-1 text-sm text-ink-secondary">
              Generating {generating.modality} ·{" "}
              <span className="tabular font-mono text-ink-secondary">
                {generating.etaLabel}
              </span>
            </p>
            <Button variant="ghost-danger" size="sm" startIcon={<Square />} onClick={onStop}>
              Stop
            </Button>
          </div>
        )}

        {/* ---- Tier 2: balance block. Explains the disabled send button rather
               than letting the user click into a failure. ---- */}
        {!affordable && (
          <div className="anim-fade-in mx-3 mt-3 flex items-start gap-2.5 rounded-xl bg-warning-soft px-3 py-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            <p className="flex-1 text-sm text-ink-secondary">
              Not enough balance for this generation — needs{" "}
              <span className="tabular font-mono font-semibold text-ink">
                ${cost.toFixed(2)}
              </span>
              , you have{" "}
              <span className="tabular font-mono font-semibold text-ink">
                ${BALANCE.remaining.toFixed(2)}
              </span>
              .
            </p>
            <a
              href="/settings/billing"
              className="shrink-0 text-sm font-semibold whitespace-nowrap text-accent-ink hover:underline"
            >
              Add funds
            </a>
          </div>
        )}

        {/* ---- Tier 2: mode tabs, revealed on hover/focus ---- */}
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden px-3 opacity-0",
            "max-h-0 transition-[max-height,opacity,padding] duration-(--duration-normal) ease-(--ease-out-quint)",
            "group-hover/composer:max-h-20 group-hover/composer:pt-3 group-hover/composer:opacity-100",
            "focus-within:max-h-20 focus-within:pt-3 focus-within:opacity-100",
            settingsOpen && "max-h-20 pt-3 opacity-100",
          )}
        >
          <SegmentedControl
            label="Output type"
            options={MODES}
            value={mode}
            onValueChange={changeMode}
            size="sm"
          />
          <button
            type="button"
            aria-label="Generation settings"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((v) => !v)}
            className={cn(
              "ml-auto grid size-8 shrink-0 place-items-center rounded-md transition-colors duration-(--duration-fast)",
              settingsOpen
                ? "bg-accent-soft text-accent-ink"
                : "text-ink-secondary hover:bg-surface-hover hover:text-ink",
            )}
          >
            <Settings2 className="size-4" />
          </button>
        </div>

        {/* ---- Tier 3: per-mode controls, pinned by click ---- */}
        {settingsOpen && (
          <div className="anim-fade-in flex flex-wrap items-center gap-2 px-3 pt-3">
            {/* Model override — the marketplace surfacing itself. */}
            <select
              aria-label="Model"
              value={selected.id}
              onChange={(e) => setModelId(e.target.value)}
              className="h-7 rounded-lg bg-surface-sunken px-2 text-sm text-ink-secondary"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.isAuto ? "Model: Auto" : `Model: ${m.name}`}
                  {m.pricePerRun > 0 ? ` — $${m.pricePerRun.toFixed(2)}` : ""}
                </option>
              ))}
            </select>

            {mode === "image" && (
              <>
                <Pill size="sm" variant="active">1:1</Pill>
                <Pill size="sm">16:9</Pill>
                <Pill size="sm">9:16</Pill>
                <Pill size="sm">Count: 2</Pill>
              </>
            )}
            {mode === "video" && (
              <>
                <Pill size="sm">4s</Pill>
                <Pill size="sm" variant="active">8s</Pill>
                <Pill size="sm">15s</Pill>
                <Pill size="sm">16:9</Pill>
              </>
            )}
            {mode === "audio" && (
              <>
                <Pill size="sm" variant="active">Warm (F)</Pill>
                <Pill size="sm">Neutral (M)</Pill>
                <Pill size="sm">Duration: Auto</Pill>
              </>
            )}

            {cost > 0 && (
              <span className="tabular ml-auto font-mono text-xs text-ink-secondary">
                Est. ${cost.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* ---- Tier 1: always visible ---- */}
        <div className="flex items-end gap-2.5 p-3">
          {/* The one thing worth showing even fully collapsed: which mode you are
              about to generate in. */}
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-ink [&_svg]:size-4"
          >
            {activeIcon}
          </span>
          <Textarea
            aria-label={`Prompt (${mode})`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={PLACEHOLDER[mode]}
            className="flex-1"
          />
          <Button
            variant="primary"
            size="lg"
            iconOnly
            aria-label={
              !affordable
                ? "Cannot send — insufficient balance"
                : value.trim()
                  ? "Send prompt"
                  : "Enter a prompt to send"
            }
            disabled={!canSend}
            className="rounded-full"
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}
