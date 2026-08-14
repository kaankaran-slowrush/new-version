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
              d: "Three layers: raw OKLCH ramps, semantic aliases, component knobs. Components reference only the semantic layer — which is what let the whole product move from a light opaque ground to a dark translucent one by remapping one layer. Card has 121 call sites and none of them changed.",
              href: "/docs/foundations/color",
            },
            {
              t: "Components carry rationale",
              d: "Each component page documents its variants, states, measurements, and — most importantly — why it behaves the way it does.",
              href: "/docs/components/button",
            },
            {
              t: "Accessibility is load-bearing",
              d: "Translucency is the language, not a coat of paint on it — so prefers-contrast and prefers-reduced-transparency get a whole second rendering of the product, opaque and dark, rather than a slightly flatter version of this one.",
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
            <h3 className="mb-1.5 text-base">
              1 · Glass is the material, and the backdrop cap is what pays for it
            </h3>
            <p className="text-sm text-ink-secondary">
              Translucency used to be reserved for navigational chrome, because
              translucency over arbitrary content is unreadable. That rule is inverted
              here, once and deliberately: the page&apos;s own plane is glass, and it is
              defensible only because <Code>--backdrop-cap</Code> imposes a worst case
              behind it — a black layer that pins the brightest pixel any photograph can
              produce to 0.22 luminance, so every contrast figure in the system is a
              measurement rather than a hope. Where nothing imposes a worst case, nothing
              is translucent: overlays open over generated media or anything else, so
              dialogs, menus, popovers and tooltips <strong>occlude</strong> at{" "}
              <Code>--color-surface-solid</Code> (0.94) with no backdrop-filter at all.
              Chrome keeps its <Code>barrier layer</Code> — a solid low-opacity fill
              beneath the content — for the same reason.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 shadow-sm">
            <h3 className="mb-1.5 text-base">2 · Neumorphism is a garnish</h3>
            <p className="text-sm text-ink-secondary">
              Neumorphism removes contrast on purpose — a control the same color as
              its ground, separated only by a soft shadow. It fails WCAG and vanishes
              in sunlight. It is allowed on exactly one class of element: small
              tactile controls whose pressed-versus-unpressed physicality is the
              information. Toggle tracks, segmented wells, slider grooves. Nothing else.
              This rule used to add &ldquo;and which carry no text&rdquo;, which was
              wrong about the code — SegmentedControl and FilterPills both put{" "}
              <Code>text-ink</Code> on <Code>.neu-raised</Code>. The real constraint is
              narrower and harder: the raised fill has to hold body-text contrast, which
              is why it is 38% and opaque (9.2:1 for ink) rather than the near-white a
              glass language reaches for first.
            </p>
          </li>
          <li className="rounded-2xl bg-surface p-5 shadow-sm">
            <h3 className="mb-1.5 text-base">3 · Motion must say something</h3>
            <p className="text-sm text-ink-secondary">
              Every named motion is tied to a specific state. This principle used to
              carve out one exception — the ambient background&apos;s drift, which earned
              its place by giving the glass something to refract. There is no exception
              now: the drifting layer was replaced by a photograph that never moves, and
              what gives the glass something to reveal is the plane scrolling over a{" "}
              <Code>fixed</Code> backdrop, which costs no animation frame at all. If you
              cannot say what a motion tells the user, it does not ship.
            </p>
          </li>
        </ol>
      </DocSection>

      <UXNote title="How to read these docs">
        <p>
          Foundations first — <strong>Color</strong> and <strong>Spatial</strong>{" "}
          explain most of the visual identity in ten minutes, and Spatial is the
          language itself rather than a theme within it. <strong>Elevation &amp; glass</strong>{" "}
          then covers what lift means on a ground this dark. Take{" "}
          <strong>Porting guide</strong> if you are adopting this on a different stack.
          Component pages are reference material; you do not need to read them front to
          back.
        </p>
      </UXNote>
    </>
  );
}
