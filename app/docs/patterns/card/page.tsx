import Link from "next/link";
import { MoreHorizontal, Sparkles } from "lucide-react";
import {
  Card,
  CardAction,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  GlassPanel,
  MeterBar,
  StatusMark,
} from "@/components/patterns";
import { Badge, Button } from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Card & surfaces" };

export default function CardDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Card & surfaces"
        lede="Card is the default container for a discrete unit of content, and it is a raised translucent tier: 7% white over the plane, sampled at 1.27× separation, bounded by a 1px hairline. GlassPanel is the same material with a blur behind it, licensed for navigational chrome. Knowing which of the two a thing is remains most of what makes this system read as considered."
      />

      <DocSection
        title="Anatomy"
        description="Six parts, each carrying one ink level. Composition, not a props bag — the card does not take a title prop."
      >
        <Example label="Card + Header / Title / Action / Body / Footer" className="bg-surface-sunken">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle meta="claude-sonnet-4-6 · eu-west-1">
                Fleet capacity
              </CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" iconOnly aria-label="Card options">
                  <MoreHorizontal />
                </Button>
              </CardAction>
            </CardHeader>
            <CardBody>
              <MeterBar value={68} label="Utilisation" showValue hint="of 40 rps" />
            </CardBody>
            <CardFooter>
              <StatusMark status="live" label="Serving" showLabel size="sm" />
              <span>Updated 14s ago</span>
            </CardFooter>
          </Card>
        </Example>

        <SpecTable
          columns={["Part", "Renders", "Spacing", "Type & ink"]}
          rows={[
            [
              "Card",
              "div",
              "18px radius, 24px padding",
              "bg-surface (7% white) + .panel-edge + shadow-sm, at text-ink",
            ],
            [
              "CardHeader",
              "div, flex row",
              "justify-between, 16px gap, items-start",
              "Layout only — carries no type of its own",
            ],
            [
              "CardTitle",
              "h3 by default (as: h2 | h3 | h4 | div)",
              "meta line sits 2px under the title",
              "Title 16px/600 at ink (the block tier); meta 12px at ink-tertiary",
            ],
            [
              "CardAction",
              "div, flex row",
              "-6px top and right margin, 4px gap",
              "Holds ghost icon buttons — no type of its own",
            ],
            [
              "CardBody",
              "div",
              "16px top margin, collapsed to 0 when first child",
              "14px at ink-secondary. flex-1, so it absorbs slack under fill",
            ],
            [
              "CardFooter",
              "div, flex row wrap",
              "16px top margin, 8px gap",
              "12px at ink-tertiary. align: start | between | end (default between)",
            ],
          ]}
        />

        <UXNote title="Why CardHeader aligns to the top, not the centre">
          <p>
            <Code>items-start</Code> rather than <Code>items-center</Code>. With a
            single-line title the two look identical, so the choice only shows itself
            once the title wraps — and then a centred action drifts into the middle of
            the text block and stops reading as a corner control.
          </p>
          <p>
            <Code>CardAction</Code> also pulls itself back by 6px on both axes. A ghost
            button&apos;s padding is invisible at rest, so left in normal flow the
            top-right corner reads as a hole. The negative margin puts the{" "}
            <strong>glyph</strong> on the optical edge rather than the button box.
          </p>
        </UXNote>

        <UXNote title="Three ink levels, minimum">
          <p>
            The section components each pin their own ink: title at <Code>ink</Code>,
            body at <Code>ink-secondary</Code>, footer and meta at{" "}
            <Code>ink-tertiary</Code>. That is not decoration — it is the reading order.
            A card whose title and body are the same grey has no entry point, and the
            eye has to read it left-to-right like prose instead of landing on the thing
            that identifies it.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="What a Card is made of"
        description="A raised translucent tier over the plane. This page described it as an opaque white box for two releases, and it was never that."
      >
        <SpecTable
          columns={["Ingredient", "Value", "What it does"]}
          rows={[
            ["Fill", "bg-surface — oklch(100% 0 0 / 0.07)", "A white alpha, so it lifts whatever it lands on by the same perceptual amount. Sampled from the rendered pixels it sits 1.27× above the plane and 1.34× above a sunken fill."],
            ["Edge", ".panel-edge — 1px of --color-line at 14% white", "With no usable drop shadow on a ground this dark, the edge is most of what says “object”. It composites at 1.55× the plane, not 1.27×, because .panel-edge clips the card's own fill to the padding box so the border is never diluted by it."],
            ["Lift", "shadow-sm — an inset specular bevel plus a 2px contact shadow", "Not a blur. See Elevation & glass for why a drop shadow has nothing to remove at luminance 0.039."],
            ["Ink", "text-ink, with the section components stepping down", "8.74 · 6.23 · 5.10 for ink / secondary / tertiary ON the card, which is the worst ground for text in the product."],
          ]}
        />
        <UXNote title="0.07 is solved, not chosen">
          <p>
            It is the largest alpha that keeps every ink level above 4.5:1 on the card
            while putting the card a readable distance from the plane. Above ~0.08{" "}
            <Code>--color-ink-tertiary</Code> fails; below ~0.05 the card stops
            separating — roughly 1.10× is where two large adjacent fills merge into one.
            Both the plane&apos;s alpha and this one were solved against{" "}
            <strong>tertiary</strong> rather than against <Code>ink</Code>, because
            tertiary is the level real information lives at and the first to fail as
            either tier lightens.
          </p>
          <p>
            <strong>The card tier is not decoration.</strong> It was{" "}
            <Code>transparent</Code> for one release, on a rule borrowed from a
            single-screen mockup — &ldquo;one plane, no nested surfaces&rdquo;. The
            product has fifteen grids and rails of <em>peer</em> cards, and with nothing
            painting, three model cards side by side read as one wall of text. It also
            silently broke the type system, whose stated doctrine is that the serif/sans
            boundary and the plane/surface boundary are the same boundary — with no
            surface there was no boundary for it to be.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>
              <Code>.surface-veil</Code> is not what makes a Card translucent. It does
              nothing at all.
            </strong>{" "}
            <Code>Card</Code> carries both <Code>bg-surface</Code> and{" "}
            <Code>surface-veil</Code>, and Tailwind orders{" "}
            <Code>@layer theme, base, components, utilities</Code>. The class is authored
            in <Code>@layer components</Code>; the utility wins on layer order regardless
            of specificity, so the veil contributes only its{" "}
            <Code>background-clip</Code>. It genuinely paints in exactly one place in the
            product — the inert composer replica on the dashboard, which carries no{" "}
            <Code>bg-*</Code>.
          </p>
          <p>
            Two consequences worth knowing. The nesting guard{" "}
            <Code>.surface-veil .surface-veil</Code> never fires on a Card, so it is not
            what protects you from stacked alphas — the language does that, by having one
            plane per view and not nesting cards. And{" "}
            <Code>--color-surface-veil</Code> is now pinned to the same value as{" "}
            <Code>--color-surface</Code>, so anything still referencing it cannot drift
            away from the card tier. Do not build on it.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="default vs footerStrip"
        description="Two variants. The question is whether reading and acting are one zone or two."
      >
        <Example label="default — content and actions share one padded box" className="bg-surface-sunken">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle meta="4 keys · 1 expiring">API keys</CardTitle>
            </CardHeader>
            <CardBody>
              Keys are shown once at creation. Rotate rather than delete if a key is in
              use by a running agent.
            </CardBody>
            <CardFooter align="end">
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </CardFooter>
          </Card>
        </Example>

        <Example label="footerStrip — actions in a sunken tray, flush to the edge" className="bg-surface-sunken">
          <Card variant="footerStrip" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle meta="1024 × 1024 · seed 88214">
                Product shot, variant 3
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="h-24 rounded-xl bg-surface-sunken" data-card-inner />
            </CardBody>
            <CardFooter>
              <span className="tabular">6.2s · $0.041</span>
              <span className="flex gap-1">
                <Button variant="ghost" size="sm">
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  Rerun
                </Button>
              </span>
            </CardFooter>
          </Card>
        </Example>

        <UXNote title="What footerStrip is actually for">
          <p>
            Result cards — media outputs, fleet rows, anything where the content is the
            payload and the actions operate <em>on</em> it. In the{" "}
            <Code>default</Code> variant the buttons float in the same air as the text,
            which is right when the actions are part of the same thought
            (&ldquo;Manage&rdquo; belongs to &ldquo;API keys&rdquo;). It is wrong when
            the content is an artefact you are deciding what to do with: then{" "}
            <strong>read</strong> and <strong>act</strong> want to be two visually
            separate zones.
          </p>
          <p>
            The tray is a <Code>surface-sunken</Code> band under a top hairline, bled to
            the card&apos;s edges with negative margins so the card keeps its normal{" "}
            <Code>p-6</Code> and nothing has to be recomputed. It keys off the{" "}
            <Code>data-card-footer</Code> attribute that <Code>CardFooter</Code> sets, so
            it only works on a <strong>direct child</strong> footer — wrap it in a div
            and the strip silently reverts to a plain footer.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Elevation"
        description="Four steps available; one correct default. Cards do not compete for depth."
      >
        <Example label="none · xs · sm (default) · md" className="bg-surface-sunken">
          {(["none", "xs", "sm", "md"] as const).map((e) => (
            <Card key={e} elevation={e} className="w-40">
              <CardBody>
                <span className="font-mono text-2xs text-ink-tertiary">
                  elevation=&quot;{e}&quot;
                </span>
              </CardBody>
            </Card>
          ))}
        </Example>

        <SpecTable
          columns={["Level", "Shadow token", "Use for"]}
          rows={[
            [
              "none",
              "none",
              "A card inside another bounded surface that already supplies the edge — a grid cell with its own hairlines, a dialog body. The card keeps its .panel-edge either way, so it is still bounded.",
            ],
            [
              "xs",
              "--shadow-xs (1px ring, no blur)",
              "Dense grids of many small cards, where a real lift per tile becomes visual noise. Note that the ring lands just outside the card's own hairline — if it reads as a doubled edge at your density, `none` is the step you want.",
            ],
            [
              "sm",
              "--shadow-sm (inset bevel + 2px contact shadow)",
              "The default and the answer nine times out of ten. Reads as an object resting on the plane.",
            ],
            [
              "md",
              "--shadow-md (brighter bevel + two blurs)",
              "Reserved. The hover target of an interactive card, or the one card on a page that genuinely is the foreground.",
            ],
          ]}
        />

        <DontNote>
          <p>
            <strong>Do not raise every card to md to make the page feel premium.</strong>{" "}
            Elevation is relative. If everything floats, nothing does — you get a page
            with no foreground, only a texture of shadows. Depth is a way of saying
            &ldquo;this one, first&rdquo;, and it only says that while the rest stay put.
          </p>
          <p>
            Also do not add a <Code>border</Code> to a card.{" "}
            <Code>Card</Code> already carries <Code>.panel-edge</Code> — one real 1px
            hairline in <Code>--color-line</Code> — and a second border on top of it is a
            doubled edge, which is one of the fastest ways to make a UI look cheap. The
            edge is why <Code>sm</Code> and <Code>md</Code> carry no ring in the first
            place.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="interactive and fill"
        description="Two booleans that only make sense in specific layouts."
      >
        <Example label="interactive — the whole card is the target" className="bg-surface-sunken">
          <Card interactive className="w-full max-w-xs">
            <CardHeader>
              <CardTitle meta="12 runs · last 3h ago">Nightly digest</CardTitle>
              <CardAction>
                <StatusMark status="idle" label="Paused" />
              </CardAction>
            </CardHeader>
            <CardBody>Hover me — the lift moves by exactly one step.</CardBody>
          </Card>
        </Example>

        <UXNote title="interactive is a style, not a role">
          <p>
            The variant adds <Code>cursor-pointer</Code>, a hover lift, and a{" "}
            <Code>scale(0.995)</Code> press. It does <strong>not</strong> make the div
            focusable or announce it as a control. If the whole card is a target, render
            the card as (or wrap it in) a real <Code>&lt;a&gt;</Code> or{" "}
            <Code>&lt;button&gt;</Code> so keyboard and screen-reader users get the same
            affordance the pointer does.
          </p>
          <p>
            The press is <Code>0.995</Code>, not the <Code>0.97</Code> a button uses. A
            large surface travelling the same proportional distance as a 40px button
            reads as the page lurching. The bigger the object, the smaller the scale.
          </p>
        </UXNote>

        <UXNote title="Rise on hover, press on active — and why the lift is only 2px">
          <p>
            The gesture is two halves and the kit shipped only one of them for a while:
            cards scaled <em>down</em> when clicked and did nothing at all when
            approached. A surface that responds to being pressed but not to being
            reached for reads as inert until the moment you commit — which is the wrong
            way round, because the hover is where the affordance needs to be announced.
          </p>
          <p>
            <strong>The hover step is the specular bevel brightening, 0.10 → 0.16</strong>{" "}
            — that is the whole difference between <Code>shadow-sm</Code> and{" "}
            <Code>shadow-md</Code> at this end of the scale. It has to be, because a fill
            change cannot do the job: hovering <Code>--color-surface</Code> (0.07) to{" "}
            <Code>--color-surface-hover</Code> (0.09) is a <strong>1.03× move</strong>,
            which is no hover at all. This variant&apos;s affordance had entirely
            evaporated before the bevel took it over.
          </p>
          <p>
            <Code>hover:-translate-y-0.5</Code> is the whole lift: <strong>2px</strong>.
            Enough to register as liftable, small enough that a grid of cards does not
            visibly reflow as the pointer crosses it. Anything larger and the row of
            neighbours appears to flinch.
          </p>
          <p>
            It pairs with <Code>hover:z-(--z-raised)</Code>, which is on the same
            variant and exists precisely for this: a lifted card casts{" "}
            <Code>shadow-md</Code>, and without the raise that shadow is clipped by
            whichever card is painted after it in the grid.
          </p>
          <p>
            Both live inside the same <Code>transition-[box-shadow,background-color,transform]</Code>,
            so the global <Code>prefers-reduced-motion</Code> block neutralises the lift
            and the press together — there is no separate gate to remember.
          </p>
        </UXNote>

        <Example label="fill — equal heights, footers pinned to the bottom" stack>
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Card variant="footerStrip" fill>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
              </CardHeader>
              <CardBody>Short body.</CardBody>
              <CardFooter align="end">
                <Button variant="secondary" size="sm">
                  Choose
                </Button>
              </CardFooter>
            </Card>
            <Card variant="footerStrip" fill>
              <CardHeader>
                <CardTitle>Scale</CardTitle>
              </CardHeader>
              <CardBody>
                A much longer body, which in a normal grid would make this card taller
                than its neighbour and leave the two footers at different heights.
              </CardBody>
              <CardFooter align="end">
                <Button variant="primary" size="sm">
                  Choose
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Example>

        <p className="mb-5 text-ink-secondary">
          <Code>fill</Code> makes the card <Code>flex h-full flex-col</Code>;{" "}
          <Code>CardBody</Code> is already <Code>flex-1</Code>, so it absorbs the slack
          and the footer lands on the bottom edge. It needs a parent that stretches its
          children — a CSS grid row does this by default, a flex row needs{" "}
          <Code>items-stretch</Code>. Two adjacent cards whose action rows sit 14px apart
          vertically is the kind of misalignment nobody can name but everybody sees.
        </p>
      </DocSection>

      <DocSection
        title="The concentric radius rule"
        description="Inner radius = outer radius − the padding between them. The single most common source of a UI that looks almost right."
      >
        <Example label="Correct: card 18px, inner surface steps down to 12px" className="bg-surface-sunken">
          <Card className="w-full max-w-xs">
            <CardBody>
              <div
                data-card-inner
                className="grid h-20 place-items-center bg-surface-sunken font-mono text-2xs text-ink-tertiary"
              >
                data-card-inner
              </div>
            </CardBody>
          </Card>
        </Example>

        <Example label="Wrong: inner radius matches the parent" className="bg-surface-sunken">
          <Card className="w-full max-w-xs">
            <CardBody>
              <div className="grid h-20 place-items-center rounded-2xl bg-surface-sunken font-mono text-2xs text-danger">
                rounded-2xl inside rounded-2xl
              </div>
            </CardBody>
          </Card>
        </Example>

        <UXNote title="Why the corners fight">
          <p>
            Two curves separated by a gap are only concentric — genuinely parallel — when
            the inner radius is the outer radius minus that gap. Match them and the gap
            between the two arcs <em>widens</em> at the corner while staying constant
            along the straight edges. Your eye reads that as the inner box drifting
            outwards, and the whole card looks slightly wrong in a way that is hard to
            name.
          </p>
          <p>
            Card is <Code>rounded-2xl</Code> (18px) with <Code>p-6</Code> (24px). Strictly
            that arithmetic lands below zero, so in practice a nested surface steps{" "}
            <strong>down one or two rungs</strong> — <Code>rounded-xl</Code> (16px) or{" "}
            <Code>rounded-lg</Code> (14px). The absolute rule is the direction: an inner
            radius must never match or exceed its parent&apos;s.
          </p>
          <p>
            Rather than trust every caller to remember, Card ships a guard: mark any
            nested surface <Code>data-card-inner</Code> and the card applies{" "}
            <Code>rounded-xl</Code> for you. That is also why the other patterns in this
            folder default to <Code>rounded-xl</Code> for their{" "}
            <Code>panel</Code> surfaces — <Code>DataTable</Code>, <Code>StatTile</Code>,{" "}
            <Code>Toolbar</Code>, <Code>ErrorState</Code> are all pre-tuned to sit inside
            a card without a corner clash.
          </p>
        </UXNote>

        <SpecTable
          columns={["Container", "Radius", "Padding", "Child radius"]}
          rows={[
            ["Card", "18px (2xl)", "24px", "16px (xl) or 14px (lg)"],
            ["Dialog / composer", "20px (3xl)", "24px", "16px (xl)"],
            ["Panel-surface pattern inside a card", "16px (xl)", "12–16px", "10px (md) or 8px (sm)"],
            ["Small control inside a sunken row", "8px (sm)", "4px", "6px (xs)"],
          ]}
        />
      </DocSection>

      <DocSection
        title="GlassPanel"
        description="A typed wrapper over the .glass utility. The effect lives in globals.css; this exists so the three rules travel with the API."
      >
        <Example className="relative overflow-hidden p-0">
          <div className="ambient-ground relative h-64 w-full">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
              <GlassPanel radius="full" padding="xs" elevation="lg" className="flex items-center gap-1">
                <span className="px-3 font-mono text-sm">
                  model<span className="font-semibold text-accent-ink">.store</span>
                </span>
                <Button variant="ghost" size="sm">
                  Agents
                </Button>
                <Button variant="ghost" size="sm">
                  Fleet
                </Button>
                <Button variant="primary" size="sm" startIcon={<Sparkles />}>
                  New
                </Button>
              </GlassPanel>
              <GlassPanel radius="2xl" padding="lg" elevation="lg" className="w-full max-w-sm">
                <p className="text-sm font-medium text-ink">Floating command surface</p>
                <p className="mt-1 text-sm text-ink-secondary">
                  Legible over a moving backdrop because the barrier layer sits between
                  this text and whatever drifts behind it.
                </p>
              </GlassPanel>
            </div>
          </div>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            [
              "radius",
              "lg · xl · 2xl · 3xl · full",
              "2xl",
              "No small rungs. Anything under 14px is a control, and a control is too small to show a blur.",
            ],
            [
              "padding",
              "none · xs · sm · md · lg",
              "md",
              "0 / 4 / 8 / 16 / 24px. `xs` is the capsule-topbar case, where the children are the padding.",
            ],
            [
              "elevation",
              "sm · md · lg · xl · composer",
              "lg",
              "There is deliberately no `none` — see rule 3.",
            ],
            [
              "bordered",
              "boolean",
              "false",
              "Opt-in hairline for a panel whose edge lands on a busy backdrop.",
            ],
            [
              "(the effect)",
              ".glass in globals.css",
              "—",
              "bg --color-glass, which IS var(--plane-fill); backdrop-filter blur(44px) saturate(180%); ::before barrier fill at oklch(14% 0.012 255 / 0.34); a 1px --color-line edge; box-shadow = an inset specular hairline plus --shadow-lg.",
            ],
          ]}
        />

        <UXNote title="The three glass rules">
          <p>
            <strong>1 · Chrome and content are the same material now.</strong>{" "}
            <Code>--color-glass</Code> is <Code>var(--plane-fill)</Code> — the page
            itself is a translucent plane, so a topbar made of anything else would read
            as a second material laid on a first. <Code>GlassPanel</Code> is still for
            the things that <em>float</em>: topbar, side rails, composer, floating
            command surfaces. If the thing holds information rather than navigation it
            is a <Code>Card</Code> — the same material, sitting still.
          </p>
          <p>
            <strong>What buys that is the backdrop cap, and nothing else does.</strong>{" "}
            The old form of this rule — chrome only, never content — existed
            because a sheer fill over <strong>arbitrary</strong> content makes contrast a
            matter of luck. In{" "}
            <Link href="/docs/foundations/spatial" className="text-accent-ink underline decoration-line-strong underline-offset-2">the one design language</Link>{" "}
            what sits behind the plane is a photograph held under{" "}
            <Code>--backdrop-cap</Code>, which pins its brightest possible pixel to 0.22
            luminance, so the worst case is imposed rather than hoped for. Translucent
            content <em>without</em> that cap is still exactly the mistake the rule
            existed to prevent.
          </p>
          <p>
            <strong>2 · The barrier layer is mandatory,</strong> and it is already inside
            the utility. <Code>.glass::before</Code> paints{" "}
            <Code>--color-glass-barrier</Code> beneath the content —{" "}
            <Code>oklch(14% 0.012 255 / 0.34)</Code>, a <em>dark</em> fill now, because
            the ink on top of it is near-white. <Code>--color-glass</Code> on its own is
            too sheer for text to survive whatever drifts under a fixed bar; the barrier
            is the difference between contrast that is guaranteed and contrast that is
            usually fine. That is the reason to use <Code>GlassPanel</Code> or{" "}
            <Code>.glass</Code> rather than hand-rolling a translucent fill with a{" "}
            <Code>backdrop-blur</Code>: you will get 90% of the look and lose the part
            that makes it legible.
          </p>
          <p>
            <strong>3 · Always paired with elevation.</strong> Translucency on its own
            reads as a rendering bug — a panel that has failed to paint. Translucency
            plus a real shadow reads as floating above the page. The utility ships{" "}
            <Code>--shadow-lg</Code>, and the <Code>elevation</Code> prop only lets you
            retune which step, never remove it. That is why the variant map has no{" "}
            <Code>none</Code>.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Glass over a flat fill is a blur of nothing.</strong> The effect is
            only worth its cost when there is something behind it to refract. In the
            product that is the backdrop photograph; in these docs it is{" "}
            <Code>.ambient-ground</Code>, a frozen static sample kept for examples that
            need a busy backdrop inside a fixed box. Over a solid fill you have paid for
            a <Code>backdrop-filter</Code>, which is expensive and compositor-bound, and
            bought a slightly milky rectangle.
          </p>
          <p>
            <strong>And never on a transient overlay.</strong> A dropdown or dialog
            appears over content nothing controls — a table, generated media, another
            menu — so no cap protects it and it cannot be see-through at any value and
            still carry a promise. All five overlays in this kit take{" "}
            <Code>bg-surface-solid</Code> (0.94) with <Code>shadow-md</Code> and{" "}
            <strong>no backdrop-filter at all</strong>: blurring an already-blurred field
            buys nothing, since the plane is smooth at 40px and a second pass is visually
            identical at the cost of a full compositor pass. Ink on one measures{" "}
            <strong>15.68:1</strong>.
          </p>
          <p>
            A handful of glass surfaces per view, not a grid of them. Degradation is
            handled centrally —{" "}
            <Code>prefers-contrast: more</Code> and{" "}
            <Code>prefers-reduced-transparency</Code> both collapse{" "}
            <Code>.glass</Code> to an opaque surface in <Code>globals.css</Code>, so
            there is nothing to do per instance.
          </p>
        </DontNote>
      </DocSection>


      <DocSection
        title="CardRail — cards in a row that bleeds to the viewport"
        description="The horizontal rail behind the Models showroom and the home page's proof strip."
      >
        <p className="mb-5 text-ink-secondary">
          It exists because <strong>three surfaces had already hand-rolled it and the
          copies had drifted</strong>. The home page&apos;s version was missing{" "}
          <Code>overscroll-x-contain</Code>, so overscrolling the strip dragged the page
          behind it — on a trackpad that feels like the rail is broken. One component,
          one recipe.
        </p>
        <SpecTable
          columns={["Decision", "Value", "Why"]}
          rows={[
            ["The bleed", "-mx-6 px-6 lg:-mx-8 lg:px-8", "Cards run to the edge of the viewport. A rail that stops flush with the text column tells you it has nothing more in it. The negative margin MUST match the page's own padding — if you change one, change both, or the rail sits a few pixels out of alignment, which is worse than not bleeding."],
            ["Snapping", "snap-x snap-mandatory + snap-start on each child", "Applied BY the component, not asked of the caller, so it cannot stop working the first time someone adds a card. A rail resting on a half-sliced card is not just untidy: a half-visible card reads as \u201cthe end\u201d, so people stop scrolling."],
            ["Page distance", "80% of the visible width", "Not 100%. Leaving a sliver of the previous card on screen is what says the list is continuous rather than paged."],
            ["Buttons", "Disable at each end; hidden below sm", "They do not wrap — wrapping a list of known length loses the reader's place. Hidden on small screens where the touch gesture is the affordance. Present at all because a mouse user with no horizontal scroll has no other way through."],
            ["Focus", "tabIndex={0} on the scroller", "A scroll region a keyboard user cannot reach is inaccessible content. Making it focusable is what lets arrow keys scroll it."],
          ]}
        />
        <UXNote title="Reduced motion needs an explicit argument here, not just CSS">
          <p>
            <Code>globals.css</Code> sets <Code>scroll-behavior: auto !important</Code>{" "}
            under <Code>prefers-reduced-motion</Code> — and a JS{" "}
            <Code>scrollBy({"{ behavior: \"smooth\" }"})</Code> <strong>ignores
            it</strong>, because the argument wins over the stylesheet. So the rail reads
            the preference at click time and passes <Code>behavior</Code> through
            explicitly. Read at click time rather than cached, so it tracks a preference
            that changes mid-session without needing a listener.
          </p>
        </UXNote>
        <UXNote title="Titleless mode, and when it is right">
          <p>
            <Code>title</Code> and the controls are both optional. A rail inside a section
            that already has a heading takes neither — the home page hero is that case,
            where a second heading would compete with the <Code>h1</Code> and a pair of
            floating arrows would read as page chrome. That rail carries an{" "}
            <Code>aria-label</Code> instead, which is <em>required</em> without a title:
            otherwise it is an unlabelled group of links.
          </p>
          <p>
            Note the cost of <Code>showControls={"{false}"}</Code>: it removes the only
            affordance a mouse-without-horizontal-scroll user has. Use it where the rail
            is supplementary, never where it is the primary path through content.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Surface decision table">
        <SpecTable
          columns={["The thing", "Surface", "Why"]}
          rows={[
            ["A unit of content", "Card — bg-surface, panel-edge, shadow-sm", "The raised tier, 1.27× the plane. Raised is lighter; that is the whole elevation system."],
            ["An artefact plus actions on it", "Card variant=\"footerStrip\"", "Read and act become two zones."],
            ["Inert content you read or copy", "bg-surface-sunken, no shadow", "Sunken says \"not a control\" — code blocks, tracks, value fields. It is BLACK at 28%, so an inset can never be confused with a card."],
            ["Persistent navigation that floats", "GlassPanel", "The plane's own material plus a blur and a lift. Same substance as a Card, different job."],
            ["A transient overlay", "bg-surface-solid, shadow-md, no blur", "Nothing imposes a cap behind it, so it must occlude rather than reveal."],
            ["A control sitting directly on a photograph", "bg-control-over-media (or -chip- for a label)", "The one surface whose backdrop the system does not control. A chip may let the image read through; a control is a target and has to look pressable."],
            ["A grid cell in a dense table of tiles", "Card elevation=\"xs\" or \"none\"", "The card's hairline is already the boundary — add the ring only if the tiles need more separation than that."],
          ]}
        />

        <Badge variant="neutral">
          Card and GlassPanel are both server-safe — no state, no effects, no directive.
        </Badge>
      </DocSection>
    </>
  );
}
