"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, TriangleAlert } from "lucide-react";
import { Icon } from "@/components/primitives/icon";
import { MODALITY_ICON } from "@/lib/icons";
import type { Turn } from "@/lib/mock/sessions";
import { cn } from "@/lib/cn";
import { ProceduralCover } from "./procedural-cover";
import { Waveform } from "./waveform";

/* =============================================================================
   Session rails — TimelineRail (left) and MediaRail (right)
   =============================================================================
   Both are floating glass overlays that sit ABOVE the canvas rather than beside
   it, and both expand on hover.

   UX NOTES
   --------
   • ABSOLUTE, NOT A FLEX COLUMN. This is what makes hover-expansion possible
     without reflowing the canvas: the panel grows over the edge of the working
     area like a flyout and then retreats. If they were layout columns, every
     hover would reflow (and re-wrap) the artifact you are looking at.

   • COMPACT AT REST, DETAIL ON DEMAND. At rest the timeline shows icon + a
     one-line prompt; hover adds the timestamp and a thumbnail via opacity. An
     earlier revision squeezed the rest state to 140px, which truncated prompts
     to "Minimal…" / "8s vi…" — unreadable, which defeats the entire point of a
     persistent history rail. 184px is the floor where a row is still identifiable.

   • STATUS MARKS NEVER HIDE. Timestamps and thumbnails are "reveal on demand";
     "something is running" and "something failed" are glanceable-critical and
     stay visible in both states.

   • CAPPED AT ~4 ROWS, THEN SCROLLS. A rail that grows with history eventually
     becomes the page. Older turns scroll inside the panel instead.

   • The MediaRail lists ONLY turns that produced media, so it answers "where is
     the video I made" without reading titles — a different question from the
     timeline's "what did I ask, in what order".
   ============================================================================= */

/** Shared glass shell for both rails. */
const railShell = [
  /* INSET BY THE SAFE AREA, not by a hardcoded 4. These sat at `top-4 left-4` /
     `right-4` — 16px from the display edge — which was fine when there was no safe
     area and wrong the moment there was one: the whole product keeps 56px clear of
     the edge on a desktop and these two were the only things that did not. */
  "glass absolute top-(--safe-area) z-(--z-rail) flex flex-col rounded-2xl",
  "max-h-(--rail-max-height) overflow-y-auto overflow-x-hidden",
  "transition-[width] duration-(--duration-normal) ease-(--ease-out-quint)",
];

function RowStatus({ turn }: { turn: Turn }) {
  if (turn.state === "generating") {
    return (
      <span
        role="img"
        aria-label="Generating"
        className="relative mt-1 grid size-3.5 shrink-0 place-items-center"
      >
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="anim-ring absolute inset-0.5 rounded-full border-[1.5px] border-accent opacity-55" />
      </span>
    );
  }
  if (turn.state === "failed") {
    return (
      <TriangleAlert
        role="img"
        aria-label="Failed"
        className="mt-0.5 size-3.5 shrink-0 text-danger"
      />
    );
  }
  return null;
}

export function TimelineRail({
  turns,
  activeId,
  onSelect,
}: {
  turns: Turn[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      aria-label="Session timeline"
      className={cn(
        railShell,
        "left-(--safe-area) w-(--rail-width-rest) p-2",
        "hover:w-(--rail-width-open) focus-within:w-(--rail-width-open)",
        "group/rail",
      )}
    >
      <Link
        href="/agents"
        className="mb-1.5 flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium text-ink-secondary transition-colors duration-(--duration-fast) hover:bg-surface-hover hover:text-ink"
      >
        <ChevronLeft className="size-3.5 shrink-0" />
        {/* Label is part of the reveal — the chevron alone is enough at rest. */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-(--duration-normal) ease-(--ease-out-quint) group-hover/rail:max-w-24 group-hover/rail:opacity-100 group-focus-within/rail:max-w-24 group-focus-within/rail:opacity-100">
          Sessions
        </span>
      </Link>

      <ol className="flex flex-col gap-1.5">
        {turns.map((turn) => {
          const active = turn.id === activeId;
          return (
            <li key={turn.id}>
              <button
                type="button"
                onClick={() => onSelect(turn.id)}
                aria-current={active ? "true" : undefined}
                title={turn.prompt}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg border p-2 text-left",
                  "transition-colors duration-(--duration-fast)",
                  active
                    ? "border-accent/30 bg-accent-soft"
                    : "border-line bg-surface hover:border-line-strong hover:bg-surface-hover",
                )}
              >
                <span
                  className={cn(
                    "grid size-5.5 shrink-0 place-items-center rounded-md [&_svg]:size-3",
                    active
                      ? "bg-surface text-accent-ink"
                      : "bg-surface-sunken text-ink-secondary",
                  )}
                >
                  <Icon of={MODALITY_ICON[turn.modality]} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{turn.prompt}</span>
                  {/* Revealed detail. */}
                  <span className="block max-h-0 overflow-hidden text-xs text-ink-secondary opacity-0 transition-[max-height,opacity] duration-(--duration-normal) group-hover/rail:mt-0.5 group-hover/rail:max-h-4 group-hover/rail:opacity-100 group-focus-within/rail:mt-0.5 group-focus-within/rail:max-h-4 group-focus-within/rail:opacity-100">
                    {turn.relativeTime}
                  </span>
                </span>

                <RowStatus turn={turn} />
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export function MediaRail({
  turns,
  activeId,
  onSelect,
}: {
  turns: Turn[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  /* Only turns that produced something visual/audible. Text answers belong in the
     timeline, not here. */
  const media = turns.filter((t) => t.modality !== "text");
  if (media.length === 0) return null;

  return (
    <aside
      aria-label="Session media"
      className={cn(
        railShell,
        "right-(--safe-area) w-(--rail-media-rest) items-center gap-2 p-2",
        "hover:w-(--rail-media-open) focus-within:w-(--rail-media-open)",
        "group/media hidden xl:flex",
      )}
    >
      <span className="max-h-0 overflow-hidden eyebrow text-ink-secondary opacity-0 transition-[max-height,opacity] duration-(--duration-normal) group-hover/media:max-h-4 group-hover/media:opacity-100">
        Media
      </span>
      {media.map((turn) => {
        const active = turn.id === activeId;
        return (
          <button
            key={turn.id}
            type="button"
            onClick={() => onSelect(turn.id)}
            aria-current={active ? "true" : undefined}
            aria-label={`${turn.modality}: ${turn.prompt}`}
            title={turn.prompt}
            className={cn(
              "relative grid size-7.5 shrink-0 place-items-center overflow-hidden rounded-lg",
              /* No fill of its own any more. The tile shows the turn's real asset,
                 or the shared cover, or a waveform if it is audio — see the frame
                 below. It used to paint one hard-coded pale gradient, so every
                 thumbnail in the strip was the same colour regardless of what it
                 pointed at, and on a dark theme the strip was a row of bright
                 rectangles. */
              "transition-[width,height,box-shadow] duration-(--duration-normal) ease-(--ease-out-quint)",
              "group-hover/media:size-12 group-focus-within/media:size-12",
              active ? "ring-2 ring-accent" : "ring-1 ring-line",
            )}
          >
            {/* THE TILE'S CONTENT, at thumbnail scale. `density="thumb"` is what
                keeps an audio waveform readable at 30px — a cover's bar count would
                be sub-pixel here and grey out into a solid block. A failed or
                in-flight turn has no asset and gets the generated cover, which is
                the honest answer rather than a picture of something that does not
                exist. */}
            {turn.image ? (
              /* eslint-disable-next-line @next/next/no-img-element -- fixture asset
                 at a known /public path; the optimiser has nothing to add to a 30px
                 thumbnail and would pull a client boundary into this rail. */
              <img
                src={turn.image}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : turn.modality === "audio" ? (
              <Waveform seed={turn.id} duration={turn.duration} density="thumb" />
            ) : (
              <ProceduralCover
                seed={turn.id}
                modality={turn.modality}
                tone={turn.state === "failed" ? "danger" : "accent"}
                className="absolute inset-0 h-auto"
              />
            )}
            {turn.state === "generating" && (
              <span className="anim-ring absolute -inset-0.5 rounded-xl border-[1.5px] border-accent opacity-60" />
            )}
            {/* `chip-over-media` + `text-ink`, and it was `bg-ink/55 text-white` — which
                inverted with the ground: `ink` is near-white here, so this was a
                near-white chip carrying white text on top of a photograph. The
                over-media token exists for exactly this job. */}
            <span className="relative rounded bg-chip-over-media p-0.5 text-ink opacity-0 transition-opacity duration-(--duration-fast) group-hover/media:opacity-100 [&_svg]:size-2.5">
              <Icon of={MODALITY_ICON[turn.modality]} />
            </span>
          </button>
        );
      })}
    </aside>
  );
}
