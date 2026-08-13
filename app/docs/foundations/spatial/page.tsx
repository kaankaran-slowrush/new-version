import Link from "next/link";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Spatial" };

const DocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-accent-ink underline decoration-line-strong underline-offset-2"
  >
    {children}
  </Link>
);

export default function SpatialDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Spatial"
        lede="A third theme, and the only one where the content surface is translucent. One plane, floating over a photograph that is held under a measured luminance cap — the cap is what buys the glass. Toggle it with the theme control in the topbar; it is the third state."
      />

      <DocSection
        title="What it is"
        description="Three rules, and the third is the one people break."
      >
        <SpecTable
          columns={["Rule", "What it means", "Why"]}
          rows={[
            [
              "One plane per view",
              "The page's content sits on a single translucent panel. Cards inside it paint nothing.",
              "Stacked translucency multiplies: two 65% planes are 42% and the inner one reads DARKER than its parent, which is the exact inversion of what elevation means.",
            ],
            [
              "One blur per plane",
              "Children never carry their own backdrop-filter. The plane blurs; everything inside it is opaque or nothing.",
              "Each backdrop-filter is a separate compositor pass over its own bounds. The count stays near eight simultaneously, which is the ceiling worth respecting on a laptop GPU.",
            ],
            [
              "No shadows on content",
              "--shadow-xs/sm/md are all `none` here. Only the plane lifts, and overlays keep lg/xl.",
              "There is nothing for a card to be elevated above — everything is on the one plane. A drop shadow inside a translucent panel reads as dirt on the glass.",
            ],
          ]}
        />

        <UXNote title="Card is not modified, and that is the point">
          <p>
            <Code>Card</Code> has 121 call sites and none of them changed. Its fill, its
            border and its shadow all resolve through tokens, so pointing all three at
            nothing turns a Card into a <strong>spacing box</strong> — it keeps its
            padding, its radius and its layout, paints nothing, and the plane shows
            through. That is exactly what this language wants from a card, and it is a
            token change rather than a refactor.
          </p>
          <p>
            The same is true of the neumorphic pair. <Code>.neu-inset</Code> and{" "}
            <Code>.neu-raised</Code> have 34 references across Switch, Slider,
            SegmentedControl, Tabs and FilterPills; redefining the two utilities under
            this theme moved all five. This theme is the second real test of the claim
            in <DocLink href="/docs/foundations/color">Color</DocLink> that retheming
            the product means remapping Layer 2, and it held.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The backdrop cap"
        description="The one number the whole theme rests on, and the reason legibility can be promised over an image the system has never seen."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          A photograph has no contrast guarantee. This theme does not ask for one — it
          imposes one. <Code>--backdrop-cap</Code> is a black layer over the image at
          0.40 opacity, which pins the brightest pixel <em>any</em> image can produce to
          0.22 luminance. The plane&apos;s alpha is then derived from that ceiling, and
          every ink value in the theme was measured against the result.
        </p>

        <SpecTable
          columns={["Token", "Value", "What it does"]}
          rows={[
            ["--backdrop-cap", "0.40", "Black over the photograph. Pins peak luminance to 0.22."],
            ["--plane-fill", "oklch(18% 0.012 255 / 0.65)", "The plane. Composites to 0.0527 over the capped peak."],
            ["--plane-blur", "40px", "One per plane. --blur-glass points at this so chrome matches."],
            ["--plane-saturate", "165%", "Blur averages colour and therefore desaturates it; this puts it back."],
            ["--plane-edge", "1px solid oklch(100% 0 0 / 0.22)", "The boundary. A translucent fill has none of its own."],
            ["--plane-lift", "0 32px 72px -24px", "The only shadow on content — it separates the plane from the photograph."],
            ["--backdrop-image", "url(...)", "Workspace override. Goes through the same cap, which is what makes it safe."],
          ]}
        />

        <DontNote>
          <p>
            <strong>
              Do not derive the cap by subtracting from 1. CSS composites in gamma
              space.
            </strong>{" "}
            This token was first written as <Code>0.78</Code>, from 1 − 0.22, as if
            opacity scaled luminance directly. It does not: a peak-white pixel under a
            0.78 black overlay renders at sRGB 0.220, whose luminance is{" "}
            <strong>0.0397 — not 0.22</strong>. Off by 5.5×. That value crushes the
            photograph to a near-black field, and every contrast figure derived from it
            is wrong in the flattering direction.
          </p>
          <p>
            The conversion runs through the transfer function:{" "}
            <Code>cap = 1 − encode(target_luminance)</Code>, which gives 0.40. The same
            correction applies to the plane itself —{" "}
            <Code>alpha × panel + (1−alpha) × backdrop</Code> is only valid on encoded
            values, per channel.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Measured contrast"
        description="Over the brightest point the cap permits, which is the worst case rather than a typical one. The shipped backdrop does contain a peak-white pixel, so these are the actual numbers."
      >
        <SpecTable
          columns={["Token", "Value", "On the plane", "Note"]}
          rows={[
            ["--color-ink", "oklch(97% 0.006 255)", "9.38:1", "Body and headings."],
            ["--color-ink-secondary", "oklch(86% 0.010 255)", "6.68:1", "Supporting copy."],
            ["--color-ink-tertiary", "oklch(80% 0.012 255)", "5.48:1", "Metadata. THE BINDING CONSTRAINT — the plane's alpha was solved for this level, not for --color-ink."],
            ["--color-ink-muted", "oklch(62% 0.014 255)", "2.81:1", "Placeholder and disabled only. Correct as-is — a disabled control that reads at full contrast is not disabled."],
            ["--color-accent", "oklch(82% 0.105 224)", "6.01:1", "Links and interactive text."],
            ["--color-success", "oklch(82% 0.125 150)", "6.13:1", ""],
            ["--color-warning", "oklch(87% 0.115 70)", "6.67:1", ""],
            ["--color-danger", "oklch(83% 0.130 25)", "5.40:1", ""],
          ]}
        />

        <UXNote title="Every value is lighter than the dim theme's, and that is counter-intuitive">
          <p>
            It would be reasonable to assume a dark translucent plane offers more
            headroom than an opaque dark card. It offers less. The dim theme&apos;s
            surface is opaque at luminance 0.039; this plane composites to 0.053,
            because a quarter of the photograph still comes through it. Inheriting
            dim&apos;s ink values unexamined would have shipped three levels that fail
            4.5:1.
          </p>
        </UXNote>

        <UXNote title="Media is the one surface with no cap">
          <p>
            The cap applies to the backdrop, not to content. A photograph inside a model
            card is real output above the plane, and it can contain a blown-out white
            pixel — the models grid does. So a chip sitting on media cannot use a
            translucent tint of the theme&apos;s card colour; there is no card colour
            here. <Code>--color-chip-over-media</Code> and{" "}
            <Code>--color-control-over-media</Code> exist for exactly that, and they are
            measured against pure white: 10.6:1 for the chip.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Opting a surface in"
        description="Two selectors cover the whole product. Neither is a class you write on a component."
      >
        <SpecTable
          columns={["Hook", "Where it is set", "What it covers"]}
          rows={[
            [
              "[data-plane-scope] > main",
              "app/(app)/layout.tsx, once",
              "All twelve product routes, without editing any of them.",
            ],
            [
              'data-plane',
              "The docs content column",
              "The default: fill, blur, edge, radius, lift.",
            ],
            [
              'data-plane="bar"',
              "The session header",
              "Edge-to-edge: no radius, no lift, a bottom hairline instead.",
            ],
            [
              'data-plane="rail"',
              "The docs index",
              "Full-height against the viewport edge: the two corners that meet it lose their radius.",
            ],
            [
              'data-plane="padded"',
              "The 404 block, the session canvas column",
              "For an element that had no padding because it was never a surface.",
            ],
            [
              "data-media-frame",
              "ProceduralCover, the two session media frames",
              "An inset hairline, so a photograph reads as set into the plane rather than pasted onto it.",
            ],
          ]}
        />

        <UXNote title="Why not just target `main`">
          <p>
            Because two of the four shells would break. /docs renders its main as a flex
            child beside a persistent index, and the 404 renders it as a{" "}
            <Code>min-h-dvh</Code> centring grid — a plane on either would be a
            full-viewport panel with the content floating in the middle of it. The scope
            marker is what keeps one rule from reaching them.
          </p>
          <p>
            Both auth pages needed nothing at all. They already render a{" "}
            <Code>GlassPanel</Code>, and under this theme <Code>.glass</Code> and the
            plane are the same material by construction, so the login card became a
            plane without being touched.
          </p>
        </UXNote>

        <UXNote title="The nesting guard is about padding, not opacity">
          <p>
            Ten product routes render a Card-producing component inside a Card, and{" "}
            <Code>/platform/run-history</Code> nests four deep. With every card
            transparent, nothing paints twice — so there is no doubled translucency to
            guard against. What doubles is <em>padding</em>: <Code>p-6</Code> inside{" "}
            <Code>p-6</Code> puts an EmptyState 48px from the plane&apos;s edge. One rule
            zeroes the inner one, and it is withdrawn under{" "}
            <Code>prefers-reduced-transparency</Code>, where the card is a real visible
            surface again and its content must not sit flush against its edge.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The two escape hatches"
        description="On the other two themes these remove an effect. Here they remove the language, so they are a supported third rendering rather than a courtesy."
      >
        <SpecTable
          columns={["Query", "What happens", "Why not fall back to light"]}
          rows={[
            [
              "prefers-reduced-transparency",
              "Opaque dark surfaces, real borders, dim's shadows restored, the photograph not downloaded at all.",
              "The ink tokens are what make this theme dark, and they are not what the query switches off. Handing it the light theme's surfaces would leave near-white ink on near-white cards.",
            ],
            [
              "prefers-contrast: more",
              "Ink pushed further from the plane, the plane fully opaque, the photograph not rendered at all.",
              "Three rules in that query force var(--color-surface), and under this theme that token is `transparent` — left alone, asking for more contrast would have made the glass completely see-through.",
            ],
          ]}
        />

        <UXNote title="The photograph costs nothing on the other two themes">
          <p>
            <Code>SpatialBackdrop</Code> is always in the root layout and switched by
            CSS, not by a conditional render — and the image is a{" "}
            <Code>background-image</Code> rather than an <Code>{"<Image>"}</Code>. A
            browser does not fetch the background of an element whose computed{" "}
            <Code>display</Code> is <Code>none</Code>, so light and dim download zero
            bytes for a backdrop they cannot see, and no client component has to wait
            for hydration to find out which theme is active. The same mechanism cancels
            the download under <Code>prefers-reduced-transparency</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The honest objection"
        description="Recorded rather than resolved, because it has not gone away."
      >
        <DontNote>
          <p>
            <strong>
              Low-contrast light-on-glass is tiring in a tool people sit in for hours.
            </strong>{" "}
            The kit&apos;s original boundary — glass for chrome, opaque for content —
            was there for that reason, and this theme inverts it. What it does not do is
            pretend the cost away: the cap exists precisely because &ldquo;usually
            legible over a photograph&rdquo; is not a promise a design system can make,
            and every number above is a worst case rather than a typical one.
          </p>
          <p>
            Light remains the documented default and dim remains the dark default.
            Spatial is a third option, chosen deliberately, and the two escape hatches
            above are the reason it is defensible at all.
          </p>
        </DontNote>

        <UXNote title="A Card demo on this page shows nothing, correctly">
          <p>
            Browse{" "}
            <DocLink href="/docs/patterns/card">Card &amp; surfaces</DocLink> with this
            theme on and the anatomy specimen appears to be missing. It is not — a Card
            under Spatial genuinely paints nothing, and a demo that special-cased itself
            to stay visible would be documenting a component that does not exist. Switch
            to light or dim to see the card, which is also the honest instruction.
          </p>
        </UXNote>
      </DocSection>
    </>
  );
}
