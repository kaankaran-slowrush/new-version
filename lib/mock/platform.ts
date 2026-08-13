/* =============================================================================
   Mock fixtures — platform surfaces (run history, webhooks, billing)
   =============================================================================
   Shapes mirror the production screens the user supplied, so a frontend engineer
   can see where their real data lands.

   Note on naming: in the real product the "model" column shows *user-named
   pipelines* ("Your Soulmate", "Social Media Heli") alongside raw vendor models
   ("xAI: Grok Imagine Video"). That distinction is preserved here via `isPipeline`
   — it matters for the UI, because a pipeline name is a link to something the user
   owns, while a vendor model name is a link to a catalogue entry.
   ============================================================================= */

export type RunCategory =
  | "Image to Image"
  | "Image to Video"
  | "Text to Video"
  | "Text to Image"
  | "Text to Speech";

export type RunStatus = "completed" | "failed" | "running" | "queued";

export interface PlatformRun {
  id: string;
  category: RunCategory;
  target: string;
  isPipeline: boolean;
  status: RunStatus;
  relativeTime: string;
  /** Null while running or when the run failed before producing anything. */
  durationLabel: string | null;
  costUsd: number;
  /** Whether a visual thumbnail exists. Text/audio runs have none — the grid
      view must not reserve a large empty box for these. */
  hasPreview: boolean;
  /** The frame itself, when `hasPreview`. Fixture asset — see
      public/artifacts/CREDITS.md. Absent means the grid falls back to a wash. */
  preview?: string;
  /** Present for API-originated runs, hidden unless "Show API calls" is on. */
  viaApi?: boolean;
}

export const PLATFORM_RUNS: PlatformRun[] = [
  { id: "74040", category: "Image to Image", target: "Your Soulmate", isPipeline: true, status: "completed", relativeTime: "9 days ago", durationLabel: "9s", costUsd: 0.038, hasPreview: true, preview: "/artifacts/cup-studio.jpg" },
  { id: "73496", category: "Image to Image", target: "Your Soulmate", isPipeline: true, status: "completed", relativeTime: "16 days ago", durationLabel: "16s", costUsd: 0.042, hasPreview: true, preview: "/artifacts/heels-red.jpg" },
  { id: "72955", category: "Image to Video", target: "Social Media Heli", isPipeline: true, status: "completed", relativeTime: "23 days ago", durationLabel: "1m 22s", costUsd: 0.215, hasPreview: true, preview: "/artifacts/interior.jpg" },
  { id: "72874", category: "Text to Video", target: "xAI: Grok Imagine Video", isPipeline: false, status: "completed", relativeTime: "24 days ago", durationLabel: "1m 11s", costUsd: 0.35, hasPreview: false, viaApi: true },
  { id: "72873", category: "Text to Video", target: "xAI: Grok Imagine Video", isPipeline: false, status: "completed", relativeTime: "24 days ago", durationLabel: "1m 11s", costUsd: 0.35, hasPreview: false },
  { id: "72872", category: "Text to Video", target: "xAI: Grok Imagine Video", isPipeline: false, status: "completed", relativeTime: "24 days ago", durationLabel: "1m 16s", costUsd: 0.35, hasPreview: false },
  { id: "72871", category: "Text to Video", target: "xAI: Grok Imagine Video", isPipeline: false, status: "failed", relativeTime: "24 days ago", durationLabel: null, costUsd: 0, hasPreview: false },
  { id: "72870", category: "Text to Speech", target: "ElevenLabs v3", isPipeline: false, status: "running", relativeTime: "just now", durationLabel: null, costUsd: 0.09, hasPreview: false },
  { id: "72869", category: "Text to Image", target: "Flux Pro 1.1", isPipeline: false, status: "completed", relativeTime: "25 days ago", durationLabel: "7s", costUsd: 0.07, hasPreview: true, preview: "/artifacts/canal.jpg", viaApi: true },
];

export const RUN_TOTAL_PAGES = 34;

export type WebhookEvent = "model.started" | "model.completed" | "model.failed";

export const WEBHOOK_EVENTS: {
  value: WebhookEvent;
  label: string;
  description: string;
}[] = [
  { value: "model.completed", label: "Model completed", description: "Fires when a model finishes processing successfully" },
  { value: "model.started", label: "Model started", description: "Fires when a model begins processing" },
  { value: "model.failed", label: "Model failed", description: "Fires when a model fails to process" },
];

export interface Webhook {
  id: string;
  name: string;
  url: string;
  apiKeyName: string;
  events: WebhookEvent[];
  active: boolean;
  successRate: number;
  lastTriggered: string | null;
}

export const WEBHOOKS: Webhook[] = [
  {
    id: "wh_1",
    name: "sasa",
    url: "https://dashboard.model.store/dashboard/tools/webhooks",
    apiKeyName: "landing",
    events: ["model.started"],
    active: true,
    successRate: 100,
    lastTriggered: "6 Aug 2026",
  },
  {
    id: "wh_2",
    name: "prod-notifier",
    url: "https://api.acme.example/hooks/model-store",
    apiKeyName: "production",
    events: ["model.completed", "model.failed"],
    active: true,
    successRate: 82,
    lastTriggered: "6 Aug 2026",
  },
  {
    id: "wh_3",
    name: "staging-sink",
    url: "https://staging.acme.example/hooks/ms",
    apiKeyName: "staging",
    events: ["model.completed"],
    active: false,
    successRate: 0,
    lastTriggered: null,
  },
];

export const API_KEY_NAMES = ["landing", "production", "staging"];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  kind: "top-up" | "usage" | "coupon";
  amountUsd: number;
  method?: string;
}

export const TRANSACTIONS: Transaction[] = [
  { id: "tx_4", date: "6 Aug 2026", description: "Balance top-up", kind: "top-up", amountUsd: 500, method: "Visa ···· 4242" },
  { id: "tx_3", date: "1 Aug 2026", description: "July usage", kind: "usage", amountUsd: -355.64 },
  { id: "tx_2", date: "14 Jul 2026", description: "Launch credit", kind: "coupon", amountUsd: 200 },
  { id: "tx_1", date: "1 Jul 2026", description: "Balance top-up", kind: "top-up", amountUsd: 500, method: "Visa ···· 4242" },
];

export const PAYMENT_METHODS = [
  { id: "pm_1", brand: "Visa", last4: "4242", expiry: "04/29", isDefault: true },
  { id: "pm_2", brand: "Mastercard", last4: "8210", expiry: "11/27", isDefault: false },
];

/** Low-balance alert threshold, in USD. Inline-editable in the UI. */
export const LOW_BALANCE_THRESHOLD = 1;

/* -----------------------------------------------------------------------------
   Run activity — 30 days to 6 Aug 2026, for ActivityStrip.

   Shaped so the strip is not a flattering ramp. It contains, deliberately:
     • a FOUR-DAY ZERO GAP around 20–23 Jul (an outage) — the thing a density
       strip exists to make visible, and which a 30-point sparkline would smudge;
     • a SPIKE of 61 on 28 Jul, so the quartile buckets have a real top end;
     • TWO TRAILING ZEROS on 5–6 Aug, so the most recent day is NOT the busiest.
   18 of 30 days are active.
   -------------------------------------------------------------------------- */
export const RUN_ACTIVITY: { label: string; value: number }[] = [
  { label: "8 Jul", value: 12 },
  { label: "9 Jul", value: 18 },
  { label: "10 Jul", value: 9 },
  { label: "11 Jul", value: 0 },
  { label: "12 Jul", value: 0 },
  { label: "13 Jul", value: 14 },
  { label: "14 Jul", value: 22 },
  { label: "15 Jul", value: 17 },
  { label: "16 Jul", value: 8 },
  { label: "17 Jul", value: 0 },
  { label: "18 Jul", value: 0 },
  { label: "19 Jul", value: 11 },
  { label: "20 Jul", value: 0 },
  { label: "21 Jul", value: 0 },
  { label: "22 Jul", value: 0 },
  { label: "23 Jul", value: 0 },
  { label: "24 Jul", value: 6 },
  { label: "25 Jul", value: 19 },
  { label: "26 Jul", value: 24 },
  { label: "27 Jul", value: 31 },
  { label: "28 Jul", value: 61 },
  { label: "29 Jul", value: 28 },
  { label: "30 Jul", value: 16 },
  { label: "31 Jul", value: 21 },
  { label: "1 Aug", value: 0 },
  { label: "2 Aug", value: 0 },
  { label: "3 Aug", value: 13 },
  { label: "4 Aug", value: 7 },
  { label: "5 Aug", value: 0 },
  { label: "6 Aug", value: 0 },
];

/* FIVE categories against a four-segment maximum — on purpose. The call site has
   to roll the two smallest into "Other", which is the discipline the docs
   prescribe, demonstrated in the one place it is actually needed. */
export const RUN_CATEGORY_MIX: { category: RunCategory; runs: number }[] = [
  { category: "Text to Image", runs: 148 },
  { category: "Image to Video", runs: 74 },
  { category: "Text to Video", runs: 41 },
  { category: "Image to Image", runs: 22 },
  { category: "Text to Speech", runs: 12 },
];
