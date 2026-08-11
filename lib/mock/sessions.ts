/* Mock fixtures — sessions, turns, and run history. */

import type { Modality } from "./agents";

export type TurnState = "done" | "generating" | "failed" | "stopped";

export interface Turn {
  id: string;
  modality: Modality;
  prompt: string;
  relativeTime: string;
  state: TurnState;
  /** Present on completed text turns. */
  text?: string;
  /** Aspect for media turns, drives the placeholder footprint. */
  aspect?: "1x1" | "16x9";
  /** For audio turns. */
  duration?: string;
  /** For the generating state. */
  progress?: number;
  stage?: string;
  etaLabel?: string;
  /** For the failed state. */
  errorTitle?: string;
  errorBody?: string;
}

/* One session that exercises every turn state on purpose: a finished image, a
   bare-prose text reply, a finished audio clip, a FAILED video, and a video
   still generating. Any fixture set missing the failure and in-flight states
   lets those screens rot unnoticed. */
export const TURNS: Turn[] = [
  {
    id: "t1",
    modality: "image",
    prompt:
      "A minimalist product shot of a ceramic coffee cup on a marble counter, soft morning light",
    relativeTime: "12m ago",
    state: "done",
    aspect: "1x1",
  },
  {
    id: "t2",
    modality: "text",
    prompt: "Write a short caption for this photo",
    relativeTime: "10m ago",
    state: "done",
    text: "Slow mornings, made for lingering. One cup, no rush.",
  },
  {
    id: "t3",
    modality: "audio",
    prompt: "Turn that caption into a voiceover, warm female voice",
    relativeTime: "7m ago",
    state: "done",
    duration: "0:08",
  },
  {
    id: "t4",
    modality: "video",
    prompt: "Make an 8 second video slowly panning across the cup",
    relativeTime: "3m ago",
    state: "failed",
    aspect: "16x9",
    errorTitle: "This video couldn't be generated",
    errorBody: "The render timed out while finalizing frames. This usually resolves on retry.",
  },
  {
    id: "t5",
    modality: "video",
    prompt: "Make an 8 second video, slow pan left to right across the cup",
    relativeTime: "now",
    state: "generating",
    aspect: "16x9",
    progress: 58,
    stage: "Rendering frames",
    etaLabel: "~40s remaining",
  },
];

export type Visibility = "private" | "workspace" | "public";

export interface SessionSummary {
  id: string;
  title: string;
  agentId: string;
  agentMonogram: string;
  relativeTime: string;
  preview: string;
  visibility: Visibility;
  /** Modality of the most recent produced artifact, for the row thumbnail. */
  lastArtifact?: Modality;
}

export const SESSIONS: SessionSummary[] = [
  {
    id: "cup-product-shot",
    // Long on purpose — the header title must truncate with an ellipsis.
    title: "Cup product shot → caption → voiceover → video",
    agentId: "studio",
    agentMonogram: "S",
    relativeTime: "now",
    preview: "Make an 8 second video, slow pan left to right across the cup",
    visibility: "private",
    lastArtifact: "video",
  },
  {
    id: "launch-teaser",
    title: "Launch teaser variations",
    agentId: "studio",
    agentMonogram: "S",
    relativeTime: "2h ago",
    preview: "Four 9:16 cuts with the logo held on the last frame",
    visibility: "workspace",
    lastArtifact: "video",
  },
  {
    id: "voice-lines",
    title: "Onboarding voice lines",
    agentId: "atelier",
    agentMonogram: "A",
    relativeTime: "Yesterday",
    preview: "Read the six onboarding steps in a calm, unhurried tone",
    visibility: "private",
    lastArtifact: "audio",
  },
  {
    id: "hero-explorations",
    title: "Hero image explorations",
    agentId: "atelier",
    agentMonogram: "A",
    relativeTime: "3 days ago",
    preview: "Wide desaturated interiors, single light source",
    visibility: "public",
    lastArtifact: "image",
  },
];

export interface RunRecord {
  id: string;
  time: string;
  runId: string;
  agent: string;
  latencyMs: number;
  tokens: number;
  status: "ok" | "failed";
}

export const RUNS: RunRecord[] = [
  { id: "r1", time: "14:32", runId: "RUN-2891", agent: "Ticket Triage", latencyMs: 212, tokens: 1204, status: "ok" },
  { id: "r2", time: "14:29", runId: "RUN-2890", agent: "Lead Qualifier", latencyMs: 340, tokens: 2048, status: "ok" },
  { id: "r3", time: "14:21", runId: "RUN-2887", agent: "Access Reviewer", latencyMs: 890, tokens: 640, status: "failed" },
  { id: "r4", time: "14:17", runId: "RUN-2884", agent: "Report Generator", latencyMs: 480, tokens: 4821, status: "ok" },
  { id: "r5", time: "14:05", runId: "RUN-2879", agent: "PR Reviewer", latencyMs: 265, tokens: 3110, status: "ok" },
  { id: "r6", time: "13:58", runId: "RUN-2874", agent: "Refund Assistant", latencyMs: 190, tokens: 880, status: "ok" },
];

export const WORKSPACE = {
  name: "Default Workspace",
  initial: "D",
  role: "Owner",
  user: { name: "kaankaran", initials: "KA", role: "Owner" },
};

/* -----------------------------------------------------------------------------
   Production volume by modality — for the home page's "what this workspace makes"
   tiles. 14 points each, oldest → newest.

   Audio is deliberately the thin one and TEXT IS DECLINING: a set where all four
   modalities climb together would hide the case the tiles exist to surface, which
   is "one of these is not being used".
   -------------------------------------------------------------------------- */
export const PRODUCTION_BY_MODALITY: {
  modality: Modality;
  total: number;
  perDay: number[];
}[] = [
  {
    modality: "image",
    total: 1284,
    perDay: [72, 88, 79, 94, 86, 101, 92, 108, 97, 112, 104, 118, 109, 124],
  },
  {
    modality: "video",
    total: 316,
    perDay: [14, 18, 16, 22, 19, 25, 21, 28, 24, 31, 26, 33, 29, 35],
  },
  {
    modality: "text",
    total: 842,
    perDay: [88, 82, 76, 71, 68, 64, 59, 62, 55, 51, 48, 44, 41, 38],
  },
  {
    modality: "audio",
    total: 97,
    perDay: [4, 6, 3, 7, 5, 8, 4, 9, 6, 7, 5, 8, 6, 9],
  },
];

/* -----------------------------------------------------------------------------
   RECENT_ARTIFACTS — what this workspace produced, across every session

   NOT a filter over TURNS. `TURNS` is documented above as one session that
   exercises every turn state, and the home page's rail claims something different:
   workspace-wide output. Building the rail out of TURNS produced a real bug — two
   of its five `find()` calls resolved to the same failed video, so the strip
   rendered the same tile twice and React got a duplicate key.

   Kept honest, per the rule this file opens with:
     • ONE failed artifact. A wall of flawless output reads as a marketing page;
       one failure is what makes the other eight credible, and generation does
       genuinely fail.
     • ONE still generating, so the in-flight state is visible in review.
     • All four modalities, weighted toward image and video the way
       PRODUCTION_BY_MODALITY says this workspace actually works.
     • One prompt long enough to clamp at two lines.
   -------------------------------------------------------------------------- */
export interface RecentArtifact {
  id: string;
  /** Which session produced it — the tile links here. */
  sessionId: string;
  modality: Modality;
  prompt: string;
  relativeTime: string;
  state: TurnState;
  duration?: string;
}

export const RECENT_ARTIFACTS: RecentArtifact[] = [
  {
    id: "a1",
    sessionId: "cup-product-shot",
    modality: "image",
    prompt:
      "A minimalist product shot of a ceramic coffee cup on a marble counter, soft morning light",
    relativeTime: "12m ago",
    state: "done",
  },
  {
    id: "a2",
    sessionId: "cup-product-shot",
    modality: "audio",
    prompt: "Turn that caption into a voiceover, warm female voice",
    relativeTime: "7m ago",
    state: "done",
    duration: "0:08",
  },
  {
    id: "a3",
    sessionId: "launch-teaser",
    modality: "video",
    prompt: "Four 9:16 cuts with the logo held on the last frame",
    relativeTime: "2h ago",
    state: "done",
    duration: "0:12",
  },
  {
    /* THE FAILURE. Exactly one, and not first — buried enough not to lead the
       strip, visible enough that nobody could call it hidden. */
    id: "a4",
    sessionId: "launch-teaser",
    modality: "video",
    prompt: "Make an 8 second video slowly panning across the cup",
    relativeTime: "3m ago",
    state: "failed",
  },
  {
    id: "a5",
    sessionId: "hero-explorations",
    modality: "image",
    prompt: "Wide desaturated interiors, single light source, no people in frame",
    relativeTime: "3 days ago",
    state: "done",
  },
  {
    id: "a6",
    sessionId: "voice-lines",
    modality: "audio",
    prompt: "Read the six onboarding steps in a calm, unhurried tone",
    relativeTime: "Yesterday",
    state: "done",
    duration: "0:41",
  },
  {
    id: "a7",
    sessionId: "cup-product-shot",
    modality: "text",
    prompt: "Write a short caption for this photo",
    relativeTime: "10m ago",
    state: "done",
  },
  {
    id: "a8",
    sessionId: "hero-explorations",
    modality: "image",
    prompt:
      "Same room at dusk, warmer key light, and push the grain a little further than the last one so it reads as film rather than digital",
    relativeTime: "3 days ago",
    state: "done",
  },
  {
    /* Still running, so the in-flight treatment is exercised on the home page. */
    id: "a9",
    sessionId: "cup-product-shot",
    modality: "video",
    prompt: "Make an 8 second video, slow pan left to right across the cup",
    relativeTime: "now",
    state: "generating",
  },
];

/* -----------------------------------------------------------------------------
   STARTER_PROMPTS — what a brand-new workspace offers instead of history

   The home page's proof rail shows what this workspace has made. On a first visit
   it has made nothing, and an empty rail with an encouraging caption is worse than
   no rail: it draws attention to the absence.

   These replace it. Not "tips" and not a tour — actual prompts, one per modality,
   phrased the way someone would really type them. The blank-page problem is the
   real obstacle on a generative product, and the fix is a filled page, not
   instructions about how to fill it.
   -------------------------------------------------------------------------- */
export interface StarterPrompt {
  id: string;
  modality: Modality;
  label: string;
  prompt: string;
}

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: "sp-image",
    modality: "image",
    label: "A product shot",
    prompt:
      "A ceramic cup on a linen backdrop, morning light, shallow depth of field",
  },
  {
    id: "sp-video",
    modality: "video",
    label: "An 8-second pan",
    prompt: "Slow pan left to right across the scene, cinematic, 8 seconds",
  },
  {
    id: "sp-audio",
    modality: "audio",
    label: "A voiceover",
    prompt: "Read this caption in a warm, unhurried voice",
  },
  {
    id: "sp-text",
    modality: "text",
    label: "A caption",
    prompt: "Write three short caption options for this image, under 12 words each",
  },
];
