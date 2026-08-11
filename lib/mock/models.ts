/* Mock fixtures — the model catalogue and per-modality pricing. */

import type { Modality } from "./agents";

/* -----------------------------------------------------------------------------
   CAPABILITIES — full words, everywhere, on purpose.

   Production is inconsistent about this: the video cards read `T2V` / `I2V`, the
   text cards read "Text to Text", and the filter sidebar reads "text to image".
   Three forms of one idea, and the reader has to learn the codes from context.

   One canonical form, spelled out. A capability is a fact about what a model
   accepts and returns; abbreviating it saves ~40px on a card and costs a first-time
   reader the ability to scan the page at all. Where a card genuinely runs out of
   room the overflow is a "+N" count, never a switch to codes — see ModelCard.
   -------------------------------------------------------------------------- */
export const CAPABILITIES = [
  "Text to image",
  "Image to image",
  "Text to video",
  "Image to video",
  "Text to speech",
  "Text to text",
  "Image to text",
  "Text to avatar",
] as const;

export type Capability = (typeof CAPABILITIES)[number];

/** Free-form editorial tags. Not an enum — production lets these grow, and the
    facet list is derived from the data rather than declared ahead of it. */
export type ModelTag = string;

/** A coarse output-character facet the production filter exposes. */
export type DisplayStyle = "Dance" | "Stilled";

export interface ModelEntry {
  id: string;
  name: string;
  vendor: string;
  modality: Modality;
  /** USD per generation, for the inline cost estimate in the composer. */
  pricePerRun: number;
  /** Card blurb. One sentence — the card clamps to two lines. */
  description: string;
  capabilities: Capability[];
  tags?: ModelTag[];
  displayStyle?: DisplayStyle;
  /** Extra qualifier surfaced next to the price (context window, resolution cap). */
  contextNote?: string;
  /** `true` for the platform's default pick in that modality. */
  isAuto?: boolean;
  /** Marks a 4K-capable model. Currently NONE are — see facetCounts. */
  is4K?: boolean;
  /** A distilled / speed-tuned variant. */
  isFast?: boolean;
  /**
   * OPTIONAL cover art. Absent throughout: this kit ships no image assets, and
   * inventing stock photography would be the one dishonest thing on the page. When
   * a URL IS present, ModelCard uses it instead of the procedural cover — so
   * dropping in real artwork later is a data change, not a code change.
   */
  coverUrl?: string;
  status: "available" | "limited" | "deprecated";
}

/* =============================================================================
   THE CATALOGUE — 28 entries

   Shaped so every designed state has something exercising it. A fixture set where
   everything is available, cheap, tagged and short-named hides exactly the layout
   bugs that matter:

     • `runway-gen4`  — status "limited"
     • `sdxl-turbo`, `whisper-tts-1` — status "DEPRECATED". There was previously no
       deprecated model at all, even though the UI branched on it in three places:
       a designed state that nothing on screen could reach.
     • `stable-video-diffusion-xt-11` — a name long enough to truncate everywhere
     • `flux-pro-11` — FOUR capabilities, which forces the card's "+N" overflow
     • several entries with NO tags, so the tag row must collapse rather than
       reserve empty space
     • NOTHING sets `is4K`, so the "4K" facet legitimately counts 0 and must render
       dimmed rather than disappear (production shows exactly this)
   ============================================================================= */
export const MODELS: ModelEntry[] = [
  /* ---- Image ---- */
  {
    id: "auto-image",
    name: "Auto",
    vendor: "model.store",
    modality: "image",
    pricePerRun: 0.04,
    description: "Routes each request to the best available image model for the prompt.",
    capabilities: ["Text to image", "Image to image"],
    contextNote: "Routing policy, not a model",
    isAuto: true,
    status: "available",
  },
  {
    id: "gpt-image-1",
    name: "GPT Image 1",
    vendor: "OpenAI",
    modality: "image",
    pricePerRun: 0.05,
    description: "Strong prompt adherence and legible text rendering inside images.",
    capabilities: ["Text to image", "Image to image"],
    tags: ["photoshoot"],
    displayStyle: "Stilled",
    status: "available",
  },
  {
    id: "imagen-4",
    name: "Imagen 4",
    vendor: "Google",
    modality: "image",
    pricePerRun: 0.06,
    description: "Photographic realism with reliable human anatomy and lighting.",
    capabilities: ["Text to image"],
    tags: ["photoshoot"],
    displayStyle: "Stilled",
    status: "available",
  },
  {
    id: "flux-pro-11",
    name: "Flux Pro 1.1",
    vendor: "Black Forest Labs",
    modality: "image",
    pricePerRun: 0.07,
    description: "The most controllable of the image models — four modes in one endpoint.",
    capabilities: ["Text to image", "Image to image", "Image to text", "Text to avatar"],
    tags: ["style transfer", "photoshoot"],
    displayStyle: "Stilled",
    contextNote: "Widest capability surface in the catalogue",
    status: "available",
  },
  {
    id: "krea-2-medium",
    name: "Krea 2 Medium",
    vendor: "Krea",
    modality: "image",
    pricePerRun: 0.03,
    description: "Balanced, cost-efficient image generation for everyday production.",
    capabilities: ["Image to image", "Text to avatar"],
    tags: ["style transfer"],
    displayStyle: "Stilled",
    status: "available",
  },
  {
    id: "krea-2-medium-turbo",
    name: "Krea 2 Medium Turbo",
    vendor: "Krea",
    modality: "image",
    pricePerRun: 0.02,
    description: "A distilled, speed-focused build of Krea 2 Medium. Fewer steps, less detail.",
    capabilities: ["Text to image", "Image to image"],
    tags: ["photoshoot"],
    displayStyle: "Stilled",
    isFast: true,
    status: "available",
  },
  {
    id: "krea-2-large",
    name: "Krea 2 Large",
    vendor: "Krea",
    modality: "image",
    pricePerRun: 0.09,
    description: "High-capability image generation. More detail, more control, bigger creativity.",
    capabilities: ["Text to image", "Image to image"],
    tags: ["style transfer", "photoshoot"],
    displayStyle: "Stilled",
    status: "available",
  },
  {
    id: "sdxl-turbo",
    name: "SDXL Turbo",
    vendor: "Stability AI",
    modality: "image",
    pricePerRun: 0.01,
    description: "Superseded by Krea 2 Medium Turbo. Kept only for reproducing older runs.",
    capabilities: ["Text to image"],
    isFast: true,
    status: "deprecated",
  },

  /* ---- Video ---- */
  {
    id: "auto-video",
    name: "Auto",
    vendor: "model.store",
    modality: "video",
    pricePerRun: 0.32,
    description: "Routes each request to the best available video model for the prompt.",
    capabilities: ["Text to video", "Image to video"],
    contextNote: "Routing policy, not a model",
    isAuto: true,
    status: "available",
  },
  {
    id: "sora-2",
    name: "Sora 2",
    vendor: "OpenAI",
    modality: "video",
    pricePerRun: 0.55,
    description: "The most cinematic option. Long shots, coherent motion, real camera language.",
    capabilities: ["Text to video", "Image to video"],
    tags: ["viral"],
    displayStyle: "Dance",
    status: "available",
  },
  {
    id: "veo-3",
    name: "Veo 3",
    vendor: "Google",
    modality: "video",
    pricePerRun: 0.48,
    description: "Native audio alongside video, which nothing else in the catalogue does.",
    capabilities: ["Text to video", "Image to video"],
    tags: ["viral"],
    displayStyle: "Dance",
    status: "available",
  },
  {
    id: "veo-31-lite",
    name: "Veo 3.1 Lite",
    vendor: "Google",
    modality: "video",
    pricePerRun: 0.19,
    description: "Google's most cost-effective video model, designed for high-volume use.",
    capabilities: ["Image to video", "Text to video"],
    displayStyle: "Dance",
    isFast: true,
    status: "available",
  },
  {
    id: "grok-imagine-video-15",
    name: "Grok Imagine Video 1.5",
    vendor: "xAI",
    modality: "video",
    pricePerRun: 0.28,
    description: "An image-to-video model from xAI. More imagination, more control.",
    capabilities: ["Text to video", "Image to video"],
    tags: ["viral"],
    displayStyle: "Dance",
    status: "available",
  },
  {
    id: "happyhorse-11",
    name: "HappyHorse 1.1",
    vendor: "Alibaba",
    modality: "video",
    pricePerRun: 0.22,
    description: "A video generation model from Alibaba, tuned for stylised motion.",
    capabilities: ["Image to video", "Text to video"],
    displayStyle: "Dance",
    status: "available",
  },
  {
    id: "ref-video-generic",
    name: "Model Store: Ref Video Generic",
    vendor: "model.store",
    modality: "video",
    pricePerRun: 0.25,
    description: "Give it a reference clip and a full-body image; it maps the motion onto the subject.",
    capabilities: ["Image to video"],
    /* NOT tagged "dance". `displayStyle: "Dance"` already carries that fact as a
       structured facet, and production shows both — which puts "Dance 7" and
       "dance 1" in the same sidebar under two different group headings with two
       different counts. A filter that appears to contradict itself teaches the
       reader that the sidebar is unreliable, so the redundant tag is dropped. */
    tags: ["viral"],
    displayStyle: "Dance",
    status: "available",
  },
  {
    id: "stable-video-diffusion-xt-11",
    name: "Stable Video Diffusion XT 1.1 (Extended Context)",
    vendor: "Stability AI",
    modality: "video",
    pricePerRun: 0.4,
    description: "Under capacity pressure — queue times are currently unpredictable.",
    capabilities: ["Image to video"],
    displayStyle: "Dance",
    status: "limited",
  },

  /* ---- Audio ---- */
  {
    id: "auto-audio",
    name: "Auto",
    vendor: "model.store",
    modality: "audio",
    pricePerRun: 0.06,
    description: "Routes each request to the best available voice model for the prompt.",
    capabilities: ["Text to speech"],
    contextNote: "Routing policy, not a model",
    isAuto: true,
    status: "available",
  },
  {
    id: "elevenlabs-v3",
    name: "ElevenLabs v3",
    vendor: "ElevenLabs",
    modality: "audio",
    pricePerRun: 0.09,
    description: "The most expressive voices, with fine control over pace and emotion.",
    capabilities: ["Text to speech"],
    tags: ["viral"],
    status: "available",
  },
  {
    id: "cartesia-sonic",
    name: "Cartesia Sonic",
    vendor: "Cartesia",
    modality: "audio",
    pricePerRun: 0.05,
    description: "Lowest-latency speech in the catalogue. Built for real-time use.",
    capabilities: ["Text to speech"],
    isFast: true,
    status: "available",
  },
  {
    id: "minimax-speech-25",
    name: "MiniMax Speech 2.5",
    vendor: "MiniMax",
    modality: "audio",
    pricePerRun: 0.04,
    description: "Broad language coverage at a low per-run price.",
    capabilities: ["Text to speech"],
    status: "available",
  },
  {
    id: "whisper-tts-1",
    name: "Whisper TTS 1",
    vendor: "OpenAI",
    modality: "audio",
    pricePerRun: 0.02,
    description: "Superseded by Cartesia Sonic. Kept only for reproducing older runs.",
    capabilities: ["Text to speech"],
    status: "deprecated",
  },

  /* ---- Text ---- */
  {
    id: "auto-text",
    name: "Auto",
    vendor: "model.store",
    modality: "text",
    pricePerRun: 0,
    description: "Routes each request to the best available text model for the prompt.",
    capabilities: ["Text to text", "Image to text"],
    contextNote: "Routing policy, not a model",
    isAuto: true,
    status: "available",
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    vendor: "Anthropic",
    modality: "text",
    pricePerRun: 0,
    description: "The strongest option for reasoning, coding and long-horizon work.",
    capabilities: ["Text to text", "Image to text"],
    contextNote: "1M context",
    status: "available",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    vendor: "Anthropic",
    modality: "text",
    pricePerRun: 0,
    description: "The balance of quality and speed most sessions should default to.",
    capabilities: ["Text to text", "Image to text"],
    contextNote: "1M context",
    status: "available",
  },
  {
    id: "gpt-56-luna",
    name: "GPT-5.6 Luna",
    vendor: "OpenAI",
    modality: "text",
    pricePerRun: 0,
    description: "Fast and cost-efficient. Suited to high-volume, latency-sensitive tasks.",
    capabilities: ["Text to text", "Image to text"],
    isFast: true,
    status: "available",
  },
  {
    id: "gpt-56-terra",
    name: "GPT-5.6 Terra",
    vendor: "OpenAI",
    modality: "text",
    pricePerRun: 0,
    description: "A balanced model delivering high-quality results across a wide range of tasks.",
    capabilities: ["Text to text"],
    status: "available",
  },
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    vendor: "Google",
    modality: "text",
    pricePerRun: 0,
    description: "Strongest multimodal understanding — reads images and documents natively.",
    capabilities: ["Text to text", "Image to text"],
    contextNote: "2M context",
    status: "available",
  },
  {
    id: "muse-spark-11",
    name: "Muse Spark 1.1",
    vendor: "Meta",
    modality: "text",
    pricePerRun: 0,
    description: "Multimodal reasoning with dynamic data fusion and strategic problem-solving.",
    capabilities: ["Text to text", "Image to text"],
    tags: ["viral"],
    status: "available",
  },
];

export function modelsFor(modality: Modality) {
  return MODELS.filter((m) => m.modality === modality);
}

export function defaultModelFor(modality: Modality) {
  return MODELS.find((m) => m.modality === modality && m.isAuto) ?? MODELS[0];
}

/* -----------------------------------------------------------------------------
   FACETS

   One source for the filter sidebar's groups, options and counts. Both the
   Showroom and the All Models page read from here rather than each hand-rolling
   `.filter().length` — which is how a count silently stops matching the grid it
   sits next to.

   Counts are computed against the FULL catalogue, not the current result set. That
   is deliberate and it is the behaviour production shows: a facet reading 0 tells
   you "nothing here has this", which is information. Recomputing against the
   filtered set would make every unselected option read 0 the moment you pick
   anything, which tells you nothing and makes the sidebar look broken.
   -------------------------------------------------------------------------- */

export type FacetGroupId = "capability" | "displayStyle" | "quality";

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetGroup {
  id: FacetGroupId;
  title: string;
  options: FacetOption[];
}

export function facetGroups(models: ModelEntry[] = MODELS): FacetGroup[] {
  const count = (fn: (m: ModelEntry) => boolean) => models.filter(fn).length;

  return [
    {
      id: "capability",
      title: "Capability",
      /* Driven by the CAPABILITIES tuple, not by what happens to appear in the
         data — so a capability no model currently offers still shows, at 0. */
      options: CAPABILITIES.map((c) => ({
        value: c,
        label: c,
        count: count((m) => m.capabilities.includes(c)),
      })),
    },
    {
      id: "displayStyle",
      title: "Display style",
      options: (["Dance", "Stilled"] as DisplayStyle[]).map((d) => ({
        value: d,
        label: d,
        count: count((m) => m.displayStyle === d),
      })),
    },
    {
      id: "quality",
      title: "Quality",
      options: [
        /* 4K is currently 0 across the catalogue. It stays in the list, dimmed —
           see the note above, and the reference screenshot which shows exactly
           this ("4K  0"). */
        { value: "4K", label: "4K", count: count((m) => m.is4K === true) },
        { value: "fast", label: "Fast version", count: count((m) => m.isFast === true) },
      ],
    },
  ];
}

/** Every tag in use, with counts, ordered by frequency. Derived from the data
    because tags are editorial and production lets them grow. */
export function tagFacets(models: ModelEntry[] = MODELS): FacetOption[] {
  const tally = new Map<string, number>();
  for (const m of models) {
    for (const t of m.tags ?? []) tally.set(t, (tally.get(t) ?? 0) + 1);
  }
  return [...tally.entries()]
    .map(([value, cnt]) => ({ value, label: value, count: cnt }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** Deliberately low so the insufficient-balance state is visible by default in
    review — a fixture set where everything is affordable hides that path. */
/* TWO INVARIANTS, and the UI depends on both being exactly true:
   `byModel` and `spendByModality` must EACH sum to `spentThisMonth` (355.64),
   because BarList `scale="total"` and MeterBar `segments` both state in print that
   they do. If you edit one row you must rebalance the rest. */
export const BALANCE = {
  remaining: 0.18,
  allowance: 1200,
  spentThisMonth: 355.64,
  spentLastMonth: 316.4,
  byModel: [
    { name: "Claude Sonnet 5", cost: 212.1 },
    { name: "Sora 2", cost: 88.4 },
    { name: "GPT Image 1", cost: 55.14 },
    /* A zero row on purpose: it forces BarList's empty-track case, which must
       render label + value on an empty track rather than a 1px stub. */
    { name: "ElevenLabs v3", cost: 0 },
  ],
  /* Six months, oldest → newest. The May dip is deliberate — a flattering
     staircase would hide the fact that a truncated money bar is a lie, which is
     the reason Sparkline defaults bars to scale="zero". */
  spendByMonth: [
    { label: "Mar", value: 128.4 },
    { label: "Apr", value: 244.9 },
    { label: "May", value: 61.2 },
    { label: "Jun", value: 289.7 },
    { label: "Jul", value: 316.4 },
    { label: "Aug", value: 355.64 },
  ],
  /* Descending, because MeterBar's segment ramp is monotonic with size. Audio at
     0 forces the zero-segment case (no span drawn, still in the legend). */
  spendByModality: [
    { label: "Text", value: 212.1 },
    { label: "Video", value: 88.4 },
    { label: "Image", value: 55.14 },
    { label: "Audio", value: 0 },
  ],
};
