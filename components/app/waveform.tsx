import * as React from "react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Waveform — what an audio artifact actually looks like
   =============================================================================

   WHY THIS EXISTS. Every other modality in the product shows its output: an image
   turn shows the image, a video turn shows a frame, a text turn shows its text. An
   audio turn used to show a coloured gradient with a speaker glyph on it — a
   placeholder standing in for something that has a perfectly good visual form.
   A waveform IS the picture of a sound clip. Nothing was being stood in for.

   It became urgent rather than merely correct with the spatial theme. On an opaque
   card a pale gradient reads as generic cover art; on a translucent plane with no
   card edge around it, the same pale rectangle reads as a hole punched in the
   panel. The theme did not create the placeholder problem, it just stopped letting
   it pass.

   DETERMINISTIC, NOT RANDOM. The bar heights come from the seed, so a given clip
   draws the same waveform on every render and on both server and client — a
   `Math.random()` here would mean a hydration mismatch on every audio turn and a
   shape that changes when you scroll away and back. Two clips with different ids
   look different; the same clip always looks like itself.

   THE BAR COUNT COMES FROM THE DURATION, so a 0:08 clip is visibly shorter-sampled
   than a 2:30 one instead of every clip being the same abstract pattern. That is
   the one piece of real information the fixture carries, and it should be visible.

   NOT A REAL FFT, AND IT DOES NOT PRETEND TO BE. There is no audio file here to
   analyse — this is a design kit. What it promises is the right SHAPE for the slot,
   at the right density, so an engineer dropping in real peak data changes the array
   and nothing else. The envelope is deliberately speech-like (see ENVELOPE) rather
   than uniform noise, because a flat band of equal bars reads as a loading state.
   ============================================================================= */

/** Same FNV-1a + MurmurHash3 finaliser as `hueFor`, and for the same reason: without
    the finaliser, ids differing by one character produce near-identical sequences,
    so two adjacent tiles in a rail would draw the same waveform. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return Math.abs(h);
}

/** "0:08" / "1:24" -> seconds. Anything unparseable falls back to 8s rather than
    throwing — a malformed duration should cost a slightly wrong bar count, not a
    blank tile. */
function secondsOf(duration: string | undefined): number {
  if (!duration) return 8;
  const parts = duration.split(":").map((n) => Number.parseInt(n, 10));
  if (parts.some(Number.isNaN)) return 8;
  const seconds = parts.reduce((total, part) => total * 60 + part, 0);
  return seconds > 0 ? seconds : 8;
}

/* A speech envelope: quiet at the edges, loudest around a third of the way in,
   with a dip where a breath would fall. Multiplied against the per-bar noise so
   the result reads as someone talking rather than as a noise floor. Sampled by
   position, so it stretches to whatever bar count the duration produces. */
const ENVELOPE = [0.28, 0.62, 0.95, 0.84, 0.7, 0.45, 0.78, 0.92, 0.66, 0.4, 0.24];

function envelopeAt(position: number): number {
  const scaled = position * (ENVELOPE.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, ENVELOPE.length - 1);
  /* Linear interpolation between stops, so the envelope is smooth at any bar
     count instead of stepping in visible blocks at high densities. */
  return ENVELOPE[index] + (ENVELOPE[next] - ENVELOPE[index]) * (scaled - index);
}

export interface WaveformProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Stable identity — the turn or artifact id. Never an index. */
  seed: string;
  /** From the fixture, as "m:ss". Drives the bar count. */
  duration?: string;
  /** How much of the clip has played, 0–1. Bars before it take the accent, bars
      after it stay muted — the same progress language the rest of the kit uses. */
  played?: number;
  /** Fewer, fatter bars for a 30px rail thumbnail; the default suits a cover. */
  density?: "thumb" | "cover";
}

export function Waveform({
  seed,
  duration,
  played = 0,
  density = "cover",
  className,
  ...props
}: WaveformProps) {
  const seconds = secondsOf(duration);
  /* Roughly four samples a second, clamped: below ~14 bars it reads as a bar chart
     rather than a waveform, and above ~72 the bars are sub-pixel at these widths
     and the whole thing greys out into a solid block. A thumbnail gets a quarter
     of the samples because it has a quarter of the room. */
  const target = density === "thumb" ? seconds : seconds * 4;
  const bars = Math.max(density === "thumb" ? 7 : 14, Math.min(72, Math.round(target)));
  const h = hash(seed);

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center gap-px bg-surface-sunken px-3",
        className,
      )}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => {
        /* One hash, many bars: shifting by the index keeps every bar a different
           value without calling the hash function per bar. The 0x9e3779b1 constant
           is the golden-ratio increment — it decorrelates successive indices, which
           a plain `h + i` does not. */
        const noise = ((h + i * 0x9e3779b1) >>> 8) % 1000 / 1000;
        /* 0.55 noise floor + 0.45 of variation, so no bar collapses to nothing —
           a zero-height bar reads as a gap in the clip, i.e. as silence, which is
           a claim about the audio rather than a texture. */
        const height = envelopeAt(i / (bars - 1)) * (0.55 + noise * 0.45);
        return (
          <span
            key={i}
            className={cn(
              "w-full min-w-px flex-1 rounded-full transition-colors duration-(--duration-fast)",
              i / bars <= played ? "bg-accent" : "bg-ink-tertiary/45",
            )}
            /* Percentages of the container rather than px, so one component serves
               a 30px rail thumb and a 160px cover with no size variants. 8% floor
               for the same reason as the noise floor above. */
            style={{ height: `${Math.max(8, height * 100).toFixed(1)}%` }}
          />
        );
      })}
    </div>
  );
}
