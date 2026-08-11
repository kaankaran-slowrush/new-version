/* =============================================================================
   Mock fixtures — agents
   =============================================================================
   This kit ships ZERO business logic. Every screen renders from static fixtures
   so a reviewer can see real-looking density (long names, failure states, empty
   values) without a backend. When porting to production, replace these modules
   with your data layer — component props are already shaped to match.

   Deliberately included: a long title that must truncate, a failed run, an idle
   agent, and a near-exhausted balance. Fixtures that only contain happy-path
   data hide exactly the layout bugs you need to catch.
   ============================================================================= */

export type Modality = "text" | "image" | "video" | "audio";

export type AgentStatus = "live" | "idle" | "error";

export interface Agent {
  id: string;
  name: string;
  monogram: string;
  tagline: string;
  description: string;
  modalities: Modality[];
  status: AgentStatus;
  /** Success rate over the trailing window, 0-100. */
  successRate: number;
  runsThisWeek: number;
  medianLatencyMs: number;
  /** Runs per day, 14 points, oldest → newest. For Sparkline. */
  runsPerDay: number[];
  /** What this agent actually produces, DESCENDING — MeterBar's segment ramp is
      monotonic with size. Shares of its own output, summing to 100. */
  outputMix: { label: string; share: number }[];
  /** Signed % change vs. the previous window. For StatTile's delta. */
  runsTrendPct: number;
  latencyTrendPct: number;
  successTrendPct: number;
}

/** The two launch agents. Both are generative-media agents; they are
    differentiated by name and monogram only — one accent, no per-agent hue. */
export const AGENTS: Agent[] = [
  {
    id: "studio",
    name: "Studio Agent",
    monogram: "S",
    tagline: "Generative media",
    description:
      "Generates images, video, audio, and text from a conversation. Chain modalities in a single session — shoot a product image, write its caption, voice it, then animate it.",
    modalities: ["text", "image", "video", "audio"],
    status: "live",
    successRate: 96,
    runsThisWeek: 184,
    medianLatencyMs: 212,
    runsPerDay: [9, 11, 10, 14, 12, 15, 13, 16, 14, 12, 15, 17, 14, 12],
    /* Studio is an image shop that occasionally does everything else. */
    outputMix: [
      { label: "Image", share: 61 },
      { label: "Text", share: 22 },
      { label: "Video", share: 12 },
      { label: "Audio", share: 5 },
    ],
    runsTrendPct: 8.2,
    latencyTrendPct: -4.1,
    successTrendPct: 1.3,
  },
  {
    id: "atelier",
    name: "Atelier Agent",
    monogram: "A",
    tagline: "Generative media",
    description:
      "The same four modalities tuned for iteration over throughput — wider variation sampling and longer context, for when you are exploring rather than producing.",
    modalities: ["text", "image", "video", "audio"],
    status: "live",
    successRate: 91,
    runsThisWeek: 62,
    medianLatencyMs: 340,
    /* Sags to zero mid-window on purpose. A fixture set where every series
       climbs pleasantly hides the layout and colour cases that actually matter. */
    runsPerDay: [7, 6, 8, 5, 4, 0, 0, 2, 5, 6, 4, 7, 5, 3],
    /* A materially different shape from Studio's — which is the point of showing
       it. Same four capabilities, completely different actual use. */
    outputMix: [
      { label: "Video", share: 44 },
      { label: "Image", share: 31 },
      { label: "Audio", share: 19 },
      { label: "Text", share: 6 },
    ],
    runsTrendPct: -14.6,
    latencyTrendPct: 11.9,
    successTrendPct: -2.4,
  },
];

/** Deployed workers shown in the Home "fleet" strip. Intentionally includes an
    idle and an error row so those states are always visible in review. */
export interface FleetEntry {
  id: string;
  name: string;
  category: string;
  status: AgentStatus;
  successRate: number;
  runs: number;
  /** Runs per day, 14 points, oldest → newest. */
  runsPerDay: number[];
  note?: string;
}

export const FLEET: FleetEntry[] = [
  {
    id: "f1",
    name: "Ticket Triage",
    category: "Support",
    status: "live",
    successRate: 98,
    runs: 62,
    runsPerDay: [3, 5, 4, 6, 5, 4, 5, 3, 6, 5, 4, 5, 4, 3],
  },
  {
    id: "f2",
    name: "Lead Qualifier",
    category: "Sales",
    status: "live",
    successRate: 91,
    runs: 40,
    runsPerDay: [2, 3, 2, 4, 3, 3, 2, 4, 3, 2, 4, 3, 3, 2],
  },
  {
    id: "f3",
    name: "Incident Summarizer",
    category: "Operations",
    status: "idle",
    successRate: 0,
    runs: 0,
    /* ALL ZERO. Forces the sparkline's dead-series state — a baseline in muted
       ink, not a flat line at mid-height, which would read as "steady". */
    runsPerDay: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    note: "Standby",
  },
  {
    id: "f4",
    name: "Report Generator",
    category: "Data",
    status: "live",
    successRate: 100,
    runs: 12,
    /* SPARSE. 12 runs scattered across 14 days with long gaps — the
       too-few-meaningful-points failure, visible on the homepage in review rather
       than discovered in production. */
    runsPerDay: [0, 0, 2, 0, 0, 3, 0, 0, 0, 4, 0, 0, 3, 0],
  },
  {
    id: "f5",
    name: "Access Reviewer",
    category: "Security",
    status: "error",
    successRate: 62,
    /* 34, not 8. The cliff below needs a real prior volume to fall FROM — with 8
       total runs there is nothing to see. Changed deliberately, not in passing. */
    runs: 34,
    /* THE CLIFF. Steady, then dead for four days — which is what "3 failures in a
       row" actually looks like over time, and the single most useful thing a
       sparkline adds to this page. A delta arrow would only say "down". */
    runsPerDay: [4, 5, 3, 4, 5, 3, 4, 3, 2, 1, 0, 0, 0, 0],
    note: "3 failures in a row",
  },
  {
    id: "f6",
    name: "PR Reviewer",
    category: "Engineering",
    status: "live",
    successRate: 95,
    runs: 71,
    runsPerDay: [4, 6, 5, 7, 6, 5, 4, 6, 5, 7, 4, 5, 4, 3],
  },
  {
    id: "f7",
    name: "Refund Assistant",
    category: "Support",
    status: "live",
    successRate: 89,
    runsPerDay: [1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1],
    runs: 19,
  },
];
