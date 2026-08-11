# model.store — UI Kit & Component Library

A **design-only** reference implementation of the model.store product surface:
every component, every screen, and the UX reasoning behind them — with **zero
business logic**. Built to be read, clicked through, and ported.

There is no data fetching, no auth, no state management beyond what a control
needs to look right. Every screen renders from static fixtures in `lib/mock/`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

Start at **`/docs`** — that is the handoff artifact. It documents every token and
component with live examples, measurements, and a "why it behaves this way"
section for each.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router) + React 19 | Server components by default; only interactive leaves are `"use client"`. |
| Styling | **Tailwind v4** (`@theme`, CSS-first) | Tokens are declared once in CSS and become *both* Tailwind utilities and plain CSS variables. That dual life is what makes this portable. |
| Primitives | **Base UI** (`@base-ui/react`) | v1 stable, maintained by MUI with several of the original Radix engineers, RTL built in. shadcn/ui itself defaults to Base UI for new projects — this is the same track, not a detour. |
| Variants | `class-variance-authority` | Makes each component's legal variant × size matrix readable in one place. |
| Motion | `motion` + CSS keyframes | CSS owns looping/ambient motion; Motion owns orchestrated enter/exit. |
| Icons | `lucide-react` | |
| Fonts | `geist` (Sans + Mono) | Self-hosted through `next/font` — no CDN, no layout shift. |

## Layout

```
styles/
  tokens.css        ← the contract. 3 token layers. Read this first.
  animations.css    ← 5 named motions, each with its reduced-motion gate built in
app/
  globals.css       ← reset, base type, .glass / .neu-* / .meter utilities,
                       and the a11y escape hatches
  page.tsx          ← Home dashboard
  agents/           ← hub + session workspace
  models/ playground/ workflows/ platform/ settings/ (auth)/
  docs/             ← the documentation site
components/
  primitives/       ← Base UI wrapped + styled. Generic, no product knowledge.
  patterns/         ← composed but still generic (Card, DataTable, EmptyState…)
  app/              ← model.store-specific composites (Composer, TimelineRail…)
  chrome/           ← TopNav, AmbientBackground, page shell
lib/
  cn.ts             ← className merge (later utilities win)
  nav.ts            ← the navigation IA
  mock/             ← static fixtures
```

## How to consume this in your own repo

### The tokens are the contract

`styles/tokens.css` has three layers, and **only the middle one matters to
components**:

1. **Base** — raw OKLCH ramps (`--color-graphite-*`, `--color-signal-*`). Never
   referenced by a component. (Renaming this ramp from `porcelain` to `graphite`
   when the palette was cooled touched exactly one file — that is the payoff of the
   three layers, and its only real test so far.)
2. **Semantic** — `--color-surface`, `--color-ink-secondary`, `--color-accent`,
   `--color-line`… **Components use only these.** Retheming the product means
   remapping this layer and nothing else.
3. **Component** — per-component knobs (`--control-height-lg`, `--rail-width-rest`).

So there are three ways to adopt this, in descending order of effort:

**If you use Tailwind v4** — copy `styles/tokens.css`, `styles/animations.css`,
and the `@layer components` block from `app/globals.css`. Component files then
drop in unchanged.

**If you use Tailwind v3** — the `@theme` block will not work. Copy the token
*values* into `tailwind.config.ts` under `theme.extend`, keep the `:root` block as
plain CSS, and replace the `x-(--token)` arbitrary-property syntax with
`x-[var(--token)]`.

**If you do not use Tailwind at all** — `tokens.css` is still valid plain CSS.
Import it, then read `var(--color-surface)` etc. from CSS Modules, styled-
components, or vanilla CSS. You lose the utility classes, not the design system.
Each `/docs` component page lists the concrete measurements so you can rebuild
the component in your own styling layer without reverse-engineering classes.

### Non-negotiables when porting

These are not stylistic preferences — dropping them breaks the design:

- **Glass is for persistent navigational chrome only** (topbar, rails, composer).
  Never body content, never transient overlays. And it must keep its barrier
  layer, or text contrast becomes luck.
- **Neumorphism only on small tactile controls** with no text on them (toggle
  tracks, segmented wells, slider grooves). It removes contrast by design; it is
  a garnish, not a language.
- **Keep the a11y escape hatches.** The `prefers-contrast: more`,
  `prefers-reduced-transparency`, and `prefers-reduced-motion` blocks in
  `globals.css` are why the atmospheric treatment is defensible.
- **Status is never color-only.** Every state pairs color with a shape or icon.
- **One accent.** Adding a second dilutes both.
- **`.tabular` on any number that can change**, or your layout will shift under
  its own data.

### What you still have to build

Everything behind the UI: data fetching, generation streaming, auth/sessions,
billing, permissions, real file handling, and the agent runtime. Component props
are shaped to receive that data, and `lib/mock/` shows the expected shape.

---

## Fixture notes

`lib/mock/` deliberately includes a failed run, an idle agent, a title long enough
to force truncation, and a near-exhausted balance. Fixtures containing only
happy-path data hide precisely the layout and state bugs worth catching, so the
error, in-flight, and empty screens are visible by default rather than reachable
only by editing code.

## Design rationale

`/docs` covers it in full. The condensed version lives in
`.claude/skills/model-store-design/SKILL.md`.
