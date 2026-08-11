---
name: model-store-design
description: Design system, visual direction, and UX doctrine for model.store — a futuristic B2B platform for provisioning AI models and deploying generative-media agents, with a chat-based core. Use whenever building or reviewing any UI/UX for model.store (app surfaces, components, docs, marketing).
---

# model.store — Design Direction

> **This repo IS the design system.** Tokens live in `styles/tokens.css`, global
> surface utilities in `app/globals.css`, motion in `styles/animations.css`, and
> live documentation with UX rationale at the `/docs` route. Read those before
> inventing anything — this file explains the *why*, the code is the *what*.

## Positioning

Two pillars drive every screen:
1. A **chat-based core** — the conversational session workspace is the product, not a widget bolted onto a dashboard.
2. A **model + agent catalog** — models are provisioned and agents are deployed by the customer.

Audience is technical operators and engineering teams. The register is B2B and
dev-tool-*adjacent* — credible and dense — but not a literal terminal. It should
feel ahead of the curve without being a toy.

## Visual direction

**Light-first.** (This corrects an earlier version of this doc that specified
dark-first; every built surface is light, and the light theme is the one that has
to look expensive.) A dark theme may be added later by remapping the semantic
token layer only — never by hard-coding dark values into components.

- **Ground**: cool graphite neutral (`--color-canvas`) — OKLCH hue 255, **96.5% L,
  deliberately NOT near-white**. Two separate decisions, both load-bearing:
  *temperature* (warm reads as paper and organic, cool reads as glass and
  instrument — this ramp was warm hue 75 "porcelain" in an earlier revision) and
  *lightness* (at the old 99% L a white card had a 1.01:1 relationship with its
  ground, so every panel floated on nothing and all the elevation work was
  invisible). Chroma rises as it darkens, 0.004 → 0.007, or a darker neutral reads
  as dirty grey rather than a tinted surface.
- **TWO TIERS OF TRANSPARENCY, and the difference matters.** `.glass` (38% fill +
  blur(44px) saturate(180%) + an 18% barrier + a specular top edge) is navigational
  chrome ONLY. The fill is low BECAUSE the blur is high: readability over a busy
  backdrop comes from destroying detail, not from opacity. The topbar additionally
  goes fully transparent until content scrolls under it (`data-lifted`) — glass with
  nothing behind it is separating itself from nothing. `.surface-veil` (80%, **no blur**)
  is the content tier — Card, Toolbar. The veil is safe where glass is not because
  it drops both things that make glass risky, and because *we control the backdrop*:
  the ambient layer is ours, so the worst case is computable. Transient overlays
  (menus, popovers, dialogs) stay fully opaque — that rule never moved. Alpha fills
  multiply, so a veil inside a veil turns opaque automatically via one descendant
  rule; never nest them by hand.
- **THE CANVAS IS NOT A TEXT BACKGROUND.** `--color-ink-tertiary` and
  `--color-ink-muted` must never sit directly on it — measured 2.54:1 over a dense
  lava overlap. Anything below `ink-secondary` needs a surface under it (card, veil
  or glass, all ≥4.77:1). Hover/pressed fills are alpha ink (3.5% / 7%), not ramp
  steps, because one solid value cannot be right on canvas, on white, on a veil and
  on a sunken input at once.
- **One accent**: `--color-accent`, a saturated blue (OKLCH hue 224 — moved from 202, where the dark end rendered #005e68 and read as petrol *green*),
  deliberately clear of the two exhausted defaults — the `#3B82F6` dev-tool blue and
  indigo/violet SaaS gradients. **Read its chroma, not just its hue.** On a warm
  ground, warm-vs-cool separated accent from surface; on a cool ground that mechanism
  is gone and only chroma contrast is left, so the accent has to be genuinely
  saturated. Desaturate it and it collapses into "a slightly bluer grey" — the
  failure mode of every cool-on-cool palette. Semantic status colors are *different
  hues* so "interactive" and "healthy" never collide.
- **Definition is a border's job; floating is a shadow's job.** Elevated surfaces
  carry one real 1.5px border (`.panel-edge` / `--border-width-panel` in
  `--color-line`) and shadow tokens contain **no** `0 0 0 1px` ring, so the two never
  double. This is what makes surfaces read as crisp objects rather than soft clouds.
  **Strong outside, quiet inside**: internal dividers (table rows, menu rules, footer
  tops) stay 1px in `--color-line-inner`, or every table turns into a spreadsheet.
- **THE PRIMARY ACTION IS INK, NOT ACCENT.** `--color-action` (near-black, 19.7:1
  with white) is the one high-emphasis button fill; `--color-accent` is reserved for
  data, selection and links. A saturated fill on a button spends the page's loudest
  colour on a control instead of on information, and it competes with the status
  colours beside it. Hover *lightens* — there is nowhere darker than 15%. Do NOT roll
  checkboxes, switches, tab indicators, meters or sparklines into ink as well.
- **Depth over decoration.** Structure comes from elevation and spacing, not from
  ornament. See the glass/neumorphism ruling below.
- **Typography — TWO VOICES, not one family at different sizes.**
  `--font-display` (Geist Mono) is the display face: **h1 and h2 only**, tight
  negative tracking. `--font-sans` carries body copy, labels and eyebrows. h3 —
  which is what `CardTitle` renders — stays sans, because the split falls exactly
  where content begins: a card title is often a long user-supplied string and
  monospace costs real readability at 16px. Mono therefore means precisely *the
  machine speaking*: the wordmark, display headings, and measured values (run IDs,
  latencies, token counts, balances, timestamps) with `.tabular`.
  `--font-display` is the ONLY place a heading font is named — one line to swap.
  Uppercase micro-labels use the single `.eyebrow` utility (sans, 500, 0.08em),
  which replaced six divergent hand-written recipes. Hierarchy is carried by
  family **and** size **and** weight **and** colour — never size alone.
- **Motion is communication.** Named motions only (`aurora`, `slow-spin`,
  `fade-in`, `rise`, `ring-pulse`, `sheen`, `soft-pulse`), each tied to a specific
  state. If you cannot say what a motion tells the user, it does not ship. Every one
  self-gates on `prefers-reduced-motion`.
- **The ambient background earns its place.** `AmbientBackground` stacks four
  transform-animated lava blobs on **prime** cycles (53/67/79/97s, so the loop can
  never be caught), a **readability scrim** over them, a 120s conic rotation, and
  static grain. Blob alphas are capped at 20% — a measured ceiling, not taste. The
  scrim is load-bearing, not decoration. Justification is not "futuristic": it is
  that translucency over a flat colour reveals nothing, so both translucent tiers
  would cost contrast and buy nothing. Never discrete orbs, bubbles or particles —
  the clearest "AI slop" tell in current product design. Animate `transform`, never
  `background-position`: the blur is then rasterised once and merely moved.
- **Icons come from `lib/icons.ts`, never re-declared.** The registry stores icon
  *components* (not JSX) so each call site inherits its parent's `[&_svg]:size-*`;
  render via `<Icon of={…} />`. Stroke weight is `--icon-stroke: 1.75` applied
  globally through `svg[stroke-width]` — lucide's default 2 is proportionally heavy
  at 14–18px and is the main reason a stock set reads as "the default icons".
- **Micro-visualisation: no charting library, no axes.** `Sparkline`, `BarList`,
  `ActivityStrip`, and `MeterBar segments` are read for shape, ranking and gaps —
  never for value, hence no ticks and no tooltips. **Never a sparkline without its
  number.** A bar is honest only when its denominator is declared; at most **one
  encoded column per table**. See `/docs/patterns/visualization`.

## The glass ⇄ neumorphism ruling

These two languages fight each other, and neumorphism specifically *removes*
contrast — a control the same color as its ground, separated only by soft shadow.
That reliably fails WCAG 2.2 and disappears in sunlight. So:

| Layer | Treatment | Where |
|---|---|---|
| Body content, data, cards | **Opaque**, `bg-surface` + elevation | Everywhere. Reading beats effect. |
| Persistent navigational chrome | **Glass** (`.glass`) — translucent + blur + barrier layer + elevation | Topbar, side rails, composer. Nothing else. |
| Transient overlays | **Opaque** | Menus, popovers, dialogs. A translucent menu over arbitrary content is unreadable. |
| Small tactile controls | **Neumorphic** (`.neu-inset` / `.neu-raised`) | Toggle tracks, segmented wells, slider grooves — and only where no long-form text sits on the surface. |

Two non-negotiables: the **barrier layer** (a solid low-opacity fill beneath glass
content, built into the `.glass` utility) keeps text ≥4.5:1; and the
**accessibility escape hatches** in `globals.css` (`prefers-contrast: more`,
`prefers-reduced-transparency`) swap all glass to solid. The design is allowed to
be atmospheric *only* because it degrades honestly on request.

## Key surfaces

1. **Home** — PROMISE-first. Leads with the composer (inert, but the real control's geometry) and a strip of real artifacts including a failed one, then the modality production tiles, then the agents, then — deliberately demoted — fleet status and spend. This replaced a status-first hierarchy: "is everything still running" is a true operator question and the wrong thing to lead with, because it describes the product as infrastructure to babysit rather than as the thing that makes the work.
2. **Agents hub** — agent-picker-first. A session can never start blank (see below), so choosing an agent *is* the entry point; the session list sits below it.
3. **Session workspace** — three zones: a compact hover-expanding **timeline rail** (navigational history), a large **center canvas** (one active turn at working size), and a **bottom composer**. Closer to a Figma history-panel-plus-canvas than a chat transcript, because the work is viewing/editing produced media, not reading a log.
4. **Models / Playground / Platform / Settings** — data-dense, opaque, table-forward.
5. **`/docs`** — the handoff artifact. Every component with all variants and states, plus UX rationale.

## Chat & agent UX doctrine

**No blank chat.** A user cannot open a generic chat box — a session always begins
by selecting an agent. The agent is the entry point, not a setting inside a chat.

**Generative UI over prose.** When a response is structured (comparisons, listings,
results, media), render a real interactive component inline. Reserve prose for
genuinely conversational replies. Reference protocols worth studying before
building the runtime: [AG-UI](https://github.com/CopilotKit/generative-ui),
[CopilotKit OpenGenerativeUI](https://github.com/CopilotKit/OpenGenerativeUI),
[OpenUI](https://github.com/thesysdev/openui).

**Agent UX discipline** — patterns a normal chat UI does not need:
- *Capability transparency* — the user knows what the agent can and cannot do
  *before* typing (persistent capability row), not by hitting a failure.
- *An honest working state* — media generation takes real seconds. Show a
  placeholder pre-sized to the eventual output (so nothing reflows), with a
  per-medium treatment and a real stage label. Never a generic spinner, never a
  three-dot typing indicator.
- *Recovery before happy path* — design the failure card first. Always two
  actions: retry, and edit-the-prompt. Never a dead end.
- *Always-available override* — the user can stop or redirect at any time; a
  user-initiated stop is a neutral "Stopped" state, not styled as an error.
- *Cost transparency* — show the estimated cost before the user commits, and block
  with a clear insufficient-balance message rather than failing after the click.
- *Restraint* — save emphasis for state changes that matter. Not every moment
  needs a flourish.

**Progressive disclosure** is the answer to density. The composer rests as input +
send only; hovering raises it and reveals mode tabs and status banners; an explicit
click pins the per-mode controls open. Same pattern on the rails: compact at rest,
detail revealed on hover via opacity, status marks always visible because
"something is running/failed" is glanceable-critical.

## What to avoid

- Generic gradient-text headlines, centered hero clichés, purple-on-white gradients.
- **Literal ambient particles, orbs, or floating bubbles** — the clearest "AI slop"
  tell. Depth comes from real elevation and one slow gradient wash whose entire
  justification is giving the glass something to refract.
- Themed-metaphor design languages (dressing the product as a greenhouse, a
  postal service, a kiln). Tried and rejected — reads as costume, not craft.
- Color as the only carrier of state. Always pair with shape, icon, or text.
- More than one accent hue. Color that appears everywhere means nothing.
- Size-only hierarchy, two-level text hierarchy, uniform card grids with uniform
  gaps — the sound of no one deciding.
- Motion that blocks usability: long entrance animations on repeat visits, or
  animated backgrounds behind readable text with no contrast control.
