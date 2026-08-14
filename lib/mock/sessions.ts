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
  /**
   * The rendered frame, on completed image and video turns only.
   *
   * Deliberately absent on t4 and t5. A failed turn produced nothing and a
   * generating one has not produced it yet, so an image on either would make the
   * canvas claim an output that does not exist — which is exactly the thing the
   * failed and in-flight treatments are there to say honestly.
   */
  image?: string;
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
      "A ceramic cup on a red seamless, hard key from the left, one clean shadow",
    relativeTime: "12m ago",
    state: "done",
    image: "/artifacts/cup-studio.jpg",
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

/* ONE TURN SET PER SESSION, keyed by id.

   Every session used to resolve to TURNS above, and the route file said so in a
   comment — which made it deliberate but did not make it right. The session list
   advertises "Onboarding voice lines · Read the six onboarding steps in a calm,
   unhurried tone" with an audio glyph; opening it showed a video being rendered of
   a ceramic cup. Four rows in a list, four different promises, one screen behind
   all of them. A reviewer clicks the second one and the kit has already contradicted
   itself.

   These are deliberately SHORTER than the flagship set. TURNS exercises every state
   on purpose — done, failed, generating, text, audio — and repeating that four times
   would be noise. These exist to make each row in the list lead somewhere that
   matches what it said, and to give the workspace three shapes the flagship does not
   have: a finished session with nothing in flight, a two-turn one, and one whose
   last turn is an image rather than a video. */
export const TURNS_BY_SESSION: Record<string, Turn[]> = {
  "cup-product-shot": TURNS,

  /* Finished, nothing in flight, and the only session whose turns are all the same
     modality — it is a variations run, so the shape of the work is "same brief,
     four cuts" rather than a chain across modalities. */
  "launch-teaser": [
    {
      id: "lt1",
      modality: "video",
      prompt: "Four 9:16 cuts from the red seamless set, logo held on the last frame",
      relativeTime: "2h ago",
      state: "done",
      image: "/artifacts/heels-red.jpg",
      aspect: "16x9",
      duration: "0:12",
    },
    {
      id: "lt2",
      modality: "video",
      prompt: "Same cut but hold the last frame two seconds longer",
      relativeTime: "2h ago",
      state: "done",
      image: "/artifacts/cars-yellow.jpg",
      aspect: "16x9",
      duration: "0:14",
    },
    {
      /* STOPPED, not failed. The user changed their mind mid-render, which is a
         different state from a render that broke — and it is the one state the
         flagship set does not cover, so it lives here rather than nowhere. */
      id: "lt3",
      modality: "video",
      prompt: "Try it once more with the logo entering from the left",
      relativeTime: "2h ago",
      state: "stopped",
      aspect: "16x9",
    },
  ],

  /* Two turns, and the shortest session in the fixture. A voiceover job is a script
     and a read — there is no chain to show, and padding it out would misrepresent
     how the work actually goes. */
  "voice-lines": [
    {
      id: "vl1",
      modality: "text",
      prompt: "Write six onboarding steps, one sentence each, no exclamation marks",
      relativeTime: "Yesterday",
      state: "done",
      text: "Connect your first model. Pick an agent to route through it. Describe what you want in your own words. Watch it build, and stop it if it drifts. Keep what works, discard what does not. Invite the person who has to approve it.",
    },
    {
      id: "vl2",
      modality: "audio",
      prompt: "Read those six steps in a calm, unhurried tone",
      relativeTime: "Yesterday",
      state: "done",
      duration: "0:38",
    },
  ],

  /* Ends on an image, which is what the list row promises, and the only PUBLIC
     session in the set — so it is also where a shared session's chrome gets seen. */
  "hero-explorations": [
    {
      id: "he1",
      modality: "image",
      prompt: "Wide desaturated interior, single light source from the left, no people",
      relativeTime: "3 days ago",
      state: "done",
      image: "/artifacts/interior-warm.jpg",
      aspect: "16x9",
    },
    {
      id: "he2",
      modality: "text",
      prompt: "Describe the lighting setup that would produce this",
      relativeTime: "3 days ago",
      state: "done",
      text: "One 4x6 softbox camera-left at roughly head height, feathered so the falloff lands before the far wall. No fill — the shadow side is doing the work. A flag behind the lens to keep the window from spilling back in.",
    },
    {
      id: "he3",
      modality: "image",
      prompt: "Same room, same light, but shoot it from the doorway",
      relativeTime: "3 days ago",
      state: "done",
      image: "/artifacts/mug-sand.jpg",
      aspect: "16x9",
    },
  ],
};

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
  /**
   * The rendered artifact, when there is one to render.
   *
   * ONLY image and video turns carry this, and that is the rule rather than the
   * state of the fixture. A failed turn produced nothing, so a picture on it
   * would be a lie about what happened. A generating turn has not produced it
   * yet — the sheen is the correct visual and replacing it with a photo would
   * make a loading state look finished. Audio and text have outputs, but neither
   * of them is a picture: see `ProceduralCover`, which draws a waveform for one
   * and sets the text for the other.
   */
  image?: string;
}

export const RECENT_ARTIFACTS: RecentArtifact[] = [
  {
    id: "a1",
    sessionId: "cup-product-shot",
    modality: "image",
    prompt:
      "A ceramic cup on a red seamless, hard key from the left, one clean shadow",
    relativeTime: "12m ago",
    state: "done",
    image: "/artifacts/cup-studio.jpg",
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
    prompt: "Four 9:16 cuts on the same red, logo held on the last frame",
    relativeTime: "2h ago",
    state: "done",
    duration: "0:12",
    image: "/artifacts/heels-red.jpg",
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
    prompt: "Wide desaturated interior, single light source, no people in frame",
    relativeTime: "3 days ago",
    state: "done",
    image: "/artifacts/interior.jpg",
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
      "Same palette, but outside — the street the building sits on, late afternoon, and push the grain further than the last one so it reads as film rather than digital",
    relativeTime: "3 days ago",
    state: "done",
    image: "/artifacts/canal.jpg",
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
