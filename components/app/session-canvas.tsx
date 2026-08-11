"use client";

import * as React from "react";
import {
  Download,
  Play,
  RefreshCw,
  Share2,
  Square,
  Sparkles,
  Video,
} from "lucide-react";
import { MODALITY_ICON } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import { Button } from "@/components/primitives";
import { Card, CardFooter, ErrorState, MeterBar } from "@/components/patterns";
import type { Modality } from "@/lib/mock/agents";
import type { Turn } from "@/lib/mock/sessions";
import { cn } from "@/lib/cn";

/* =============================================================================
   SessionCanvas — the center stage of the session workspace
   =============================================================================
   Renders ONE turn at working size. This is the product's focal surface: the
   thing a user is looking at, editing, and acting on.

   UX NOTES
   --------
   • ONE TURN AT A TIME, NOT A TRANSCRIPT. The work here is viewing and editing
     produced media, not re-reading a conversation. A scrolling chat log forces
     the artifact to compete with its own history for space; a canvas plus a
     history rail gives the artifact the room and keeps navigation one click away.
     This is closer to Figma's history panel + canvas than to a chat app.

   • THE PROMPT IS A CAPTION, NOT A MESSAGE. It sits above the result as small
     contextual text ("You asked · Video"). Rendering it as a chat bubble would
     imply the conversation is the content — it is the instruction.

   • WORKING STATES ARE SIZED TO THE OUTPUT. The placeholder claims the eventual
     aspect ratio up front, so nothing reflows when the real result lands. A
     layout that jumps at completion is worse than a slower one: the user has
     already started moving their cursor.

   • NEVER A GENERIC SPINNER. Each medium gets an honest state: image sweeps a
     sheen, video reports its real stage ("Rendering frames"), audio fills a
     waveform. And a Stop control is always present — the user can always take
     back control mid-task.

   • FAILURE IS DESIGNED FIRST. Two recovery actions, always: retry as-is, and
     edit the prompt. Never a dead end. Danger colour appears as an edge accent
     and an icon, never as a full red wash.
   ============================================================================= */

const MODALITY_LABEL: Record<Modality, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
};

/** Stand-in for real generated media. Deliberately abstract — a fake photo would
    make the kit look like it does more than it does. */
function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-[radial-gradient(120%_90%_at_25%_20%,oklch(94%_0.03_202)_0%,transparent_55%),radial-gradient(100%_80%_at_80%_75%,oklch(94.2%_0.007_75)_0%,transparent_60%),linear-gradient(160deg,oklch(97.5%_0.005_75),oklch(88.5%_0.008_75))]",
        className,
      )}
    />
  );
}

function TurnHeader({ turn }: { turn: Turn }) {
  return (
    <header className="mb-5">
      <p className="mb-1.5 eyebrow text-ink-tertiary">
        You asked ·{" "}
        <span className="text-accent-ink">{MODALITY_LABEL[turn.modality]}</span>
      </p>
      <p className="max-w-measure text-base text-ink">{turn.prompt}</p>
    </header>
  );
}

/** Shared action strip. Every finished artifact can be taken away (download),
    shown to someone (share), or tried again (regenerate). */
function ResultActions({
  onRegenerate,
  extra,
}: {
  onRegenerate?: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <CardFooter align="between">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" startIcon={<Download />}>
          Download
        </Button>
        <Button variant="ghost" size="sm" startIcon={<Share2 />}>
          Share
        </Button>
      </div>
      <div className="flex items-center gap-1">
        {extra}
        <Button
          variant="ghost"
          size="sm"
          startIcon={<RefreshCw />}
          onClick={onRegenerate}
        >
          Regenerate
        </Button>
      </div>
    </CardFooter>
  );
}

function AudioResult({ turn }: { turn: Turn }) {
  /* 15 bars, first 10 "played". Heights are fixed rather than random so the
     component renders identically on server and client — a random waveform is a
     hydration mismatch waiting to happen. */
  const bars = [40, 65, 30, 80, 50, 90, 35, 60, 45, 75, 55, 35, 65, 40, 50];
  return (
    <div className="flex items-center gap-4 p-6">
      <button
        aria-label="Play voiceover"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-text transition-transform duration-(--duration-instant) active:scale-95"
      >
        {/* Optical nudge: a play triangle centred geometrically reads left-heavy. */}
        <Play className="size-4 translate-x-px" fill="currentColor" />
      </button>
      <div className="flex h-12 flex-1 items-center gap-[3px]" aria-hidden>
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-[3px] rounded-full",
              i < 10 ? "bg-accent" : "bg-ink-muted",
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <span className="tabular shrink-0 font-mono text-xs text-ink-tertiary">
        0:03 / {turn.duration}
      </span>
    </div>
  );
}

function GeneratingResult({ turn }: { turn: Turn }) {
  const isAudio = turn.modality === "audio";

  return (
    <Card variant="footerStrip" className="overflow-hidden" aria-busy>
      {isAudio ? (
        /* Audio has no frame to sweep, so its working state fills the waveform
           bar-by-bar instead — the medium's own visual vocabulary. */
        <div className="flex items-center gap-4 p-6">
          <div className="flex h-12 flex-1 items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "anim-soft-pulse w-[3px] rounded-full",
                  i < 6 ? "bg-accent" : "bg-ink-muted/50",
                )}
                style={{
                  height: `${30 + ((i * 17) % 60)}%`,
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </div>
          <span className="shrink-0 font-mono text-xs text-ink-secondary">
            {turn.stage}…
          </span>
        </div>
      ) : (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-surface-sunken",
            turn.aspect === "1x1" ? "aspect-square" : "aspect-video",
          )}
        >
          <MediaPlaceholder />
          {/* The sweep. Self-gated on prefers-reduced-motion. */}
          <span className="anim-sheen absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.55)_48%,transparent_66%)] bg-[length:220%_100%] bg-[position:130%_0]" />
          {/* Static structure so this still reads as "working" in a screenshot
              or with motion disabled — not as an empty grey box. */}
          <span className="relative text-ink-tertiary opacity-55 [&_svg]:size-8">
            <Icon of={MODALITY_ICON[turn.modality]} />
          </span>
          <span className="relative rounded-full bg-surface/85 px-3 py-1.5 font-mono text-sm text-ink-secondary">
            {turn.stage}…
          </span>
        </div>
      )}

      <MeterBar
        value={turn.progress ?? 0}
        className="rounded-none"
        aria-label="Generation progress"
      />

      <CardFooter align="between">
        <span className="tabular font-mono text-xs text-ink-tertiary">
          {turn.etaLabel}
        </span>
        {/* Always-available override. */}
        <Button variant="ghost-danger" size="sm" startIcon={<Square />}>
          Stop
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SessionCanvas({
  turn,
  onRegenerate,
}: {
  turn: Turn;
  onRegenerate?: () => void;
}) {
  return (
    /* `key` forces a remount per turn so the fade-in actually replays on switch
       rather than only on first render. */
    <article key={turn.id} className="anim-fade-in w-full">
      <TurnHeader turn={turn} />

      {turn.state === "generating" && <GeneratingResult turn={turn} />}

      {turn.state === "failed" && (
        /* ErrorState makes BOTH recovery props required — retry alone is not a
           recovery path when the request itself is the problem. */
        <ErrorState
          title={turn.errorTitle ?? "This couldn't be generated"}
          message={turn.errorBody ?? "The generation did not complete."}
          detail={`turn ${turn.id}`}
          retryLabel="Try again"
          onRetry={() => {}}
          secondaryLabel="Edit prompt"
          onSecondary={() => {}}
        />
      )}

      {turn.state === "stopped" && (
        /* Neutral, NOT an error. The user chose this; styling their own decision
           as a failure is both wrong and mildly insulting. */
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-sunken px-5 py-4">
          <p className="text-sm text-ink-secondary">
            Stopped before finishing. Nothing was charged.
          </p>
          <Button variant="secondary" size="sm" startIcon={<Sparkles />}>
            Resume
          </Button>
        </div>
      )}

      {turn.state === "done" && turn.modality === "text" && (
        /* Prose renders bare — no card. Wrapping a sentence in chrome implies
           it is an artifact to manage rather than an answer to read. */
        <p className="max-w-measure px-0.5 text-base leading-relaxed text-ink">
          {turn.text}
        </p>
      )}

      {turn.state === "done" && turn.modality === "image" && (
        <Card variant="footerStrip" className="overflow-hidden">
          <div className="relative aspect-square bg-surface-sunken">
            <MediaPlaceholder />
          </div>
          <ResultActions
            onRegenerate={onRegenerate}
            extra={
              <Button variant="ghost" size="sm" startIcon={<Sparkles />}>
                Variations
              </Button>
            }
          />
        </Card>
      )}

      {turn.state === "done" && turn.modality === "video" && (
        <Card variant="footerStrip" className="overflow-hidden">
          <div className="relative grid aspect-video place-items-center bg-surface-sunken">
            <MediaPlaceholder />
            <button
              aria-label="Play video"
              className="relative grid size-15 place-items-center rounded-full bg-surface/92 shadow-md transition-transform duration-(--duration-instant) active:scale-95"
            >
              <Play className="size-5 translate-x-0.5" fill="currentColor" />
            </button>
            <div className="absolute inset-x-3.5 bottom-3 h-[3px] overflow-hidden rounded-full bg-white/50">
              <span className="block h-full w-[38%] rounded-full bg-white" />
            </div>
          </div>
          <ResultActions onRegenerate={onRegenerate} />
        </Card>
      )}

      {turn.state === "done" && turn.modality === "audio" && (
        <Card variant="footerStrip" className="overflow-hidden">
          <AudioResult turn={turn} />
          <ResultActions onRegenerate={onRegenerate} />
        </Card>
      )}
    </article>
  );
}
