import Link from "next/link";
import { Code, DocHeader, DocSection, UXNote } from "@/components/docs/doc-kit";

export const metadata = { title: "Introduction" };

export default function DocsIntro() {
  return (
    <>
      <DocHeader
        eyebrow="model.store UI kit"
        title="A design system you can port, not just look at."
        lede="Every component, every screen, and the reasoning behind them — with zero business logic. Built so a frontend engineer can lift what they need into a production codebase without reverse-engineering intent from markup."
      />

      <DocSection
        title="What this is"
        description="A complete reference implementation of the model.store product surface. There is no data fetching, no auth, no state management beyond what a control needs to look correct. Every screen renders from static fixtures."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              t: "Tokens are the contract",
              d: "Three layers: raw OKLCH ramps, semantic aliases, component knobs. Components reference only the semantic layer, so retheming is one file.",
              href: "/docs/foundations/color",
            },
            {
              t: "Components carry rationale",
              d: "Each component page documents its variants, states, measurements, and — most importantly — why it behaves the way it does.",
              href: "/docs/components/button",
            },
            {
              t: "Accessibility is load-bearing",
              d: "The atmospheric treatment is defensible only because it degrades honestly: contrast, transparency, and motion preferences all have real fallbacks.",
              href: "/docs/foundations/accessibility",
            },
            {
              t: "Agent UX has its own doctrine",
              d: "Interfaces where an agent acts on the user's behalf need patterns a normal chat UI does not: capability transparency, honest working states, recovery before happy path.",
              href: "/docs/ux/agents",
            },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="group rounded-2xl bg-surface p-5 shadow-sm transition-shadow duration-(--duration-fast) hover:shadow-md"
            >
              <h3 className="mb-1.5 text-base group-hover:text-accent-ink">{c.t}</h3>
              <p className="text-sm text-ink-secondary">{c.d}</p>
            </Link>
          ))}
        </div>
      </DocSection>

      <DocSection
        title="The three rulings that shape everything"
        description="Most of this system is ordinary craft. These three decisions are the ones that would break the design if reversed, so they are stated up front."
      >
        <ol className="space-y-5">
          <li className="rounded-2xl bg-surface p-5 shadow-sm">
            <h3 className="mb-1.5 text-base">1 · Glass is chrome only</h3>
            <p className="text-sm text-ink-secondary">
              Translucent, blurred surfaces are reserved for persistent navigational
              chrome — the topbar, the side rails, the composer. Never body content
              (reading beats effect) and never transient overlays like menus, where
              translucency over arbitrary content is simply unreadable. Every glass
              surface carries a <Code>barrier layer</Code>: a solid low-opacity fill
              beneath the content so text contrast is guaranteed rather than lucky.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 shadow-sm">
            <h3 className="mb-1.5 text-base">2 · Neumorphism is a garnish</h3>
            <p className="text-sm text-ink-secondary">
              Neumorphism removes contrast on purpose — a control the same color as
              its ground, separated only by a soft shadow. It fails WCAG and vanishes
              in sunlight. It is allowed on exactly one class of element: small
              tactile controls whose pressed-versus-unpressed physicality is the
              information, and which carry no text. Toggle tracks, segmented wells,
              slider grooves. Nothing else.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 shadow-sm">
            <h3 className="mb-1.5 text-base">3 · Motion must say something</h3>
            <p className="text-sm text-ink-secondary">
              Five named motions exist, each tied to a specific state. The ambient
              background drift is the only decorative-looking one, and it earns its
              place by giving the glass something to refract — without it, the
              translucency is wasted. If you cannot say what a motion tells the user,
              it does not ship.
            </p>
          </li>
        </ol>
      </DocSection>

      <UXNote title="How to read these docs">
        <p>
          Foundations first — <strong>Color</strong> and{" "}
          <strong>Elevation &amp; glass</strong> explain most of the visual identity
          in ten minutes. Then <strong>Porting guide</strong> if you are adopting
          this on a different stack. Component pages are reference material; you do
          not need to read them front to back.
        </p>
      </UXNote>
    </>
  );
}
