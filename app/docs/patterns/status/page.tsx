import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  MeterBar,
  StatTile,
  StatusMark,
} from "@/components/patterns";
import { Badge } from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  Swatch,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Status & progress" };

const STATUSES = [
  { status: "live", label: "Serving" },
  { status: "idle", label: "Paused" },
  { status: "error", label: "Failed: rate limited" },
  { status: "success", label: "Completed" },
] as const;

export default function StatusDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Status & progress"
        lede="Two components, one shared discipline: the meaning must survive the loss of colour. StatusMark differs in shape before it differs in hue, and MeterBar is the single proportion motif the whole product reuses. If you read one page in this kit for the reasoning rather than the props, read this one."
      />

      <DocSection
        title="Status is never colour-only"
        description="This is the rule StatusMark exists to enforce. Everything else on the page follows from it."
      >
        <Example label="live · idle · error · success — at md, with labels" stack>
          <div className="flex flex-wrap gap-6">
            {STATUSES.map((s) => (
              <StatusMark key={s.status} status={s.status} label={s.label} showLabel />
            ))}
          </div>
        </Example>

        <Example label="The same four marks with all colour removed" stack>
          <div className="flex flex-wrap gap-6 grayscale">
            {STATUSES.map((s) => (
              <StatusMark key={s.status} status={s.status} label={s.label} showLabel />
            ))}
          </div>
          <p className="text-xs text-ink-tertiary">
            Still four distinguishable marks. A green dot and a red dot in the same test
            are one dot, twice.
          </p>
        </Example>

        <UXNote title="Why this is a hard rule and not a nice-to-have">
          <p>
            <strong>Roughly one in twelve men has a colour-vision deficiency</strong>{" "}
            (about 8%, against roughly 1 in 200 women), and the most common form is
            precisely red/green. That alone is a large slice of any operator audience. But
            it is not the strongest part of the argument, because a colour-only status
            fails several ways at once:
          </p>
          <p>
            It does not survive <strong>greyscale</strong> — printed runbooks, an
            e-ink display, a monochrome projector in a war room. It does not survive a{" "}
            <strong>screenshot pasted into a ticket</strong>, which is how failures
            actually travel between people: cropped, rescaled, sometimes recoloured by a
            dark-mode extension, and read by someone who has never seen your dashboard and
            has no legend. It does not survive <strong>a glance from across a
            desk</strong>, where a 12px hue difference simply is not resolvable. And it
            does not survive <strong>a screen reader</strong> at all, which is why{" "}
            <Code>label</Code> is a required prop here rather than an optional one.
          </p>
          <p>
            So every state differs in <strong>form first</strong>. Colour is then layered
            on top to make the mark <em>faster</em> to read — which is what colour is
            genuinely good at, and all it should ever be asked to do.
          </p>
        </UXNote>

        <SpecTable
          columns={["Status", "Form", "Colour", "Means"]}
          rows={[
            [
              "live",
              "Solid dot (6px at sm, 8px at md) plus an expanding pulse ring — the only state that moves",
              "--color-success",
              "Something is happening right now. In flight, streaming, serving.",
            ],
            [
              "idle",
              "Hollow ring: a 2px border with nothing filled in (10px at sm, 14px at md)",
              "--color-idle (graphite-400)",
              "Present, not doing anything. Paused, queued, archived. The form is literally an absence.",
            ],
            [
              "error",
              "A TRIANGLE — not a circle at all. lucide TriangleAlert, 2.25 stroke",
              "--color-danger",
              "Failed. The silhouette alone says problem, at any size and in any colour.",
            ],
            [
              "success",
              "Filled disc with a check inside (12px at sm, 16px at md, 3.5 stroke)",
              "--color-success",
              "Finished, and finished well. Distinct from `live` by the glyph, not the hue.",
            ],
          ]}
        />

        <Example label="The two colours doing the reinforcing" stack>
          <div className="flex flex-wrap gap-4">
            <Swatch token="--color-success" name="--color-success" note="live, success" />
            <Swatch token="--color-idle" name="--color-idle" note="idle" />
            <Swatch token="--color-danger" name="--color-danger" note="error" />
          </div>
        </Example>

        <DontNote>
          <p>
            <strong>Do not add a fifth state by picking a new colour.</strong> There is no{" "}
            <Code>warning</Code> in this vocabulary, and adding{" "}
            <Code>bg-warning</Code> to the <Code>live</Code> dot would produce a mark that
            is identical to <Code>live</Code> for a meaningful share of your users. A new
            state needs a new <em>shape</em>, and if you cannot draw one that resolves at
            12px, you do not have room for a new state — say it in words instead.
          </p>
          <p>
            <strong>Do not build a status pill out of a bare coloured dot plus a{" "}
            <Code>&lt;span&gt;</Code>.</strong> That is the shortcut this component
            exists to remove. It loses the shape distinction, loses the{" "}
            <Code>role=&quot;img&quot;</Code> and accessible name, and loses the
            reduced-motion gating on the pulse.
          </p>
          <p>
            <strong>And do not scale it below 12px.</strong> There is no{" "}
            <Code>xs</Code> size on purpose: under 12px the check and the triangle stop
            resolving into recognisable silhouettes, which puts you straight back to
            colour-only.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="StatusMark in place"
        description="Two sizes, two label modes. It is designed to be read in a table row without stealing the row."
      >
        <Example label="sm (12px) — table rows, pills, dense lists" stack>
          <div className="flex flex-wrap gap-5">
            {STATUSES.map((s) => (
              <StatusMark
                key={s.status}
                size="sm"
                status={s.status}
                label={s.label}
                showLabel
              />
            ))}
          </div>
        </Example>

        <Example label="Mark only — the label goes to sr-only text, never nowhere">
          {STATUSES.map((s) => (
            <StatusMark key={s.status} status={s.status} label={s.label} />
          ))}
          <Badge variant="neutral">Tab through nothing — hover a mark with a screen reader on</Badge>
        </Example>

        <Example label="In a card header, and as a tile adornment" stack>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle meta="eu-west-1 · 40 rps ceiling">claude-sonnet-4-6</CardTitle>
                <StatusMark status="live" label="Serving" />
              </CardHeader>
              <CardBody>
                <MeterBar value={68} label="Utilisation" showValue />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle meta="last attempt 41m ago">kling-v2-master</CardTitle>
                <StatusMark status="error" label="Failed: rate limited" />
              </CardHeader>
              <CardBody>
                <MeterBar value={100} tone="danger" label="Quota" showValue hint="hard cap" />
              </CardBody>
            </Card>
          </div>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["status", "live · idle · error · success", "required", "There is no default — an unspecified status is a bug, not a state."],
            ["label", "string", "REQUIRED", "\"Running\", \"Paused\", \"Failed: rate limited\". A bare coloured dot is invisible to a screen reader, so this is not optional."],
            ["showLabel", "boolean", "false", "true renders the label beside the mark at ink-secondary; false puts it in role=\"img\" aria-label."],
            ["size", "sm 12px · md 16px", "md", "No xs — see the Avoid note above."],
            ["Box", "inline-grid, place-items-center, shrink-0", "—", "The box never changes size between statuses or during the pulse."],
            ["Pulse", ".anim-ring on an absolute span, bg-success/40", "—", "Same colour as the core at low alpha, so it reads as the dot's own emanation rather than a second object. pointer-events-none."],
            ["Label ink", "sm 11px · md 12px, ink-secondary, truncate", "—", "Below the value it annotates, so it supports rather than competes."],
          ]}
        />

        <UXNote title="Motion is reserved for live, and the box never grows">
          <p>
            Exactly one state moves. If <Code>idle</Code> also shimmered, &ldquo;something
            is happening right now&rdquo; would have no way left to announce itself —
            movement is the loudest channel in an interface and it can only be spent once
            per vocabulary.
          </p>
          <p>
            The ring is <Code>absolute</Code> and the mark box is a fixed size, so the
            pulse paints outside the layout box. An expanding ring that participated in
            layout would nudge every row of a table on a 1.8-second loop, which is
            genuinely unpleasant to work above for an hour. Reduced-motion gating lives
            inside the <Code>.anim-ring</Code> utility, so it applies everywhere the
            utility is used and there is nothing to remember per instance.
          </p>
          <p>
            Note that <Code>StatusMark</Code> is server-safe despite all this: the pulse
            is pure CSS, so there is no state, no effect, and no{" "}
            <Code>&quot;use client&quot;</Code>. It renders inside a server-rendered table
            without pulling the table into the client bundle.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="MeterBar"
        description="The product's one recurring proportion motif. Not one of several — the only one."
      >
        <Example label="The four tones at default thickness" stack>
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <MeterBar value={64} tone="accent" label="Utilisation" showValue />
            <MeterBar value={92} tone="success" label="Delivery rate" showValue hint="7d" />
            <MeterBar value={78} tone="warning" label="Quota used" showValue hint="of 5,000" />
            <MeterBar value={100} tone="danger" label="Rate limit" showValue hint="hard cap" />
          </div>
        </Example>

        <Example label="Thickness: hairline 2px · default 3px · thick 6px · chunky 10px" stack>
          <div className="grid w-full gap-5">
            <MeterBar value={42} thickness="hairline" label="hairline — 2px" showValue />
            <MeterBar value={42} thickness="default" label="default — 3px" showValue />
            <MeterBar value={42} thickness="thick" label="thick — 6px" showValue />
            <MeterBar value={42} thickness="chunky" label="chunky — 10px" showValue />
          </div>
        </Example>

        <Example label="Bare, with no header row — needs aria-label" stack>
          <div className="w-full max-w-sm">
            <MeterBar value={31} aria-label="Generation progress" />
          </div>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["value", "number 0–100", "required", "Clamped in the component, so an out-of-range or NaN value can never overflow the track."],
            ["tone", "accent · success · warning · danger", "accent", "Semantic, never decorative — see below."],
            ["thickness", "hairline 2 · default 3 · thick 6 · chunky 10 (px)", "default", "Sets the --meter-thickness token the .meter utility reads, so height stays one source of truth."],
            ["label", "node", "—", "Left caption above the strip, 12px at ink-secondary, truncated."],
            ["showValue", "boolean | node", "—", "true renders `{rounded value}%`. Pass a node for a real unit — \"3.2k / 5k\" beats a bare percentage. 12px/500 at ink, .tabular."],
            ["hint", "node", "—", "11px at ink-muted, right of the value. Units, plan name, ETA."],
            ["aria-label", "string", "—", "Required when there is no visible label: a bare bar is announced as \"progress bar\" and nothing else."],
            ["Track", ".meter — full radius, bg --color-line, overflow hidden", "—", "Radius is --radius-full at every thickness, so the fill's leading edge is always a cap, never a square."],
            ["Fill", ".meter > span, transition-[width]", "—", "220ms at --ease-out-quint. Width is an inline style because a percentage cannot be a Tailwind class."],
            ["Semantics", "role=\"progressbar\" + aria-valuenow/min/max", "—", "valuenow is the clamped, rounded value."],
          ]}
        />

        <UXNote title="One motif, reused everywhere something has a proportion">
          <p>
            The same 3px strip carries fleet-card load, in-flight generation progress,
            balance remaining against a plan, webhook delivery rate, and the optional
            quota bar under a <Code>StatTile</Code>. That repetition is the entire point.
          </p>
          <p>
            A product that invents a new proportion treatment per screen — a ring here, a
            striped bar there, a percentage donut on the billing page — teaches the user
            nothing, because each one has to be decoded on arrival. The same strip in five
            places becomes something they read <em>without</em> reading: they know where it
            sits, they know full is right, they know the colour is a judgement, and they
            have learned all of that once.
          </p>
          <p>
            So do not add a second one. If a new surface needs a proportion, it needs this,
            possibly at a new <Code>thickness</Code>. That is what the thickness scale is
            for — the same motif at the scale the surface can carry, not a different motif.
          </p>
        </UXNote>

        <Example label="The motif in its four homes" stack>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <StatTile
              surface="panel"
              label="Fleet load"
              value="68"
              unit="%"
              meter={{ value: 68, tone: "accent" }}
              adornment={<StatusMark status="live" label="Serving" size="sm" />}
            />
            <StatTile
              surface="panel"
              label="Generation"
              value="31"
              unit="%"
              caption="~40s remaining"
              meter={{ value: 31, tone: "accent" }}
            />
            <StatTile
              surface="panel"
              label="Balance"
              value="$1,284"
              meter={{ value: 26, tone: "warning", showValue: "26% of plan" }}
            />
            <StatTile
              surface="panel"
              label="Webhook delivery"
              value="99.2"
              unit="%"
              delta="0.4%"
              deltaDirection="down"
              invertDelta
              meter={{ value: 99, tone: "success" }}
            />
          </div>
        </Example>

        <UXNote title="Tone is a judgement, thickness is a scale">
          <p>
            <Code>accent</Code> is the neutral proportion: <em>this is how much of a thing
            there is.</em> <Code>success</Code>, <Code>warning</Code> and{" "}
            <Code>danger</Code> are claims <em>about</em> that proportion. A bar that turns
            red must mean something is actually wrong — the moment red appears on a healthy
            metric because it happened to be near 100%, red has stopped meaning anything
            anywhere in the product.
          </p>
          <p>
            Which way is bad also depends on the metric, and the component cannot know: 92%
            delivery rate is good, 92% of a rate limit is not. That is the caller&apos;s
            call, and it is the reason <Code>tone</Code> is an explicit prop rather than a
            threshold the component derives.
          </p>
          <p>
            Thickness is about the surface, not the severity. The default 3px is a{" "}
            <strong>glance value</strong> — the moment a meter gets tall enough to look
            like a chart, people start expecting the axes, gridlines and tooltips it does
            not have. <Code>hairline</Code> is for a strip under a dense table row;{" "}
            <Code>thick</Code> and <Code>chunky</Code> are for a hero progress bar that is
            the only thing on screen. Never reach for <Code>chunky</Code> to signal
            urgency; that is what <Code>tone</Code> and the label are for.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Tone is never the only carrier.</strong> Same rule as{" "}
            <Code>StatusMark</Code>, same reasons — a red bar and a green bar are the same
            bar in greyscale, in a screenshot, and for one in twelve men. Pass{" "}
            <Code>label</Code> and <Code>showValue</Code> so the state reads as words and
            a number, with colour as the thing that makes it fast rather than the thing
            that makes it legible. <Code>showValue</Code> taking a node instead of just a
            boolean exists for this: &ldquo;4,912 / 5,000&rdquo; is a far more useful
            sentence than &ldquo;98%&rdquo;.
          </p>
          <p>
            <strong>Do not animate the fill on first paint,</strong> and do not use the
            meter as a loading indicator for something whose progress you cannot measure.
            The width transition is 220ms on <Code>width</Code> only, which makes an update
            look like the bar is <em>measuring</em>; a bar that snaps looks like a
            re-render, and a bar that fills on a timer while nothing is being tracked is a
            fabrication the user will eventually catch.
          </p>
          <p>
            <strong>And do not stack meters to compare series.</strong> Four bars in a
            column is a glance at four unrelated proportions; it is not a chart, and it
            will be misread as one the moment the labels get long. If you need comparison
            across categories, you need a chart, and a chart is not this component.
          </p>
        </DontNote>

        <UXNote title="Segmenting one bar is not stacking four">
          <p>
            Read the ban above carefully, because it is narrower than it looks. Four
            stacked meters are wrong because each bar has its{" "}
            <strong>own, undeclared denominator</strong> while sitting in a column that
            invites length comparison. The problem was never the mark — it was the missing
            scale. So the rule generalises to:{" "}
            <strong>a bar is honest when its denominator is declared.</strong>
          </p>
          <p>
            That leaves stacked meters banned, and licenses the two constructions which do
            declare one: <Code>MeterBar</Code> with <Code>segments</Code> (exactly one
            denominator — the strip itself) and <Code>BarList</Code> (one denominator,
            printed above the rows, and literally built out of MeterBars, so there is no
            new mark to learn). Both live on <Code>Micro-visualisation</Code>, along with
            why segmented mode drops <Code>role=&quot;progressbar&quot;</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The shared checklist"
        description="Applies to any state or progress indicator you add to this product, including ones not on this page."
      >
        <SpecTable
          columns={["Check", "Why it is on the list"]}
          rows={[
            ["Does it differ in shape, glyph or position — not only hue?", "Colour survives neither greyscale, a pasted screenshot, nor ~8% of male viewers."],
            ["Does it have an accessible name?", "StatusMark's `label` and MeterBar's `aria-label` are required for exactly this reason. \"Progress bar\" alone tells a screen-reader user nothing."],
            ["Is the number tabular?", "A live-updating value in proportional figures re-measures itself and shifts everything beside it."],
            ["Is it the only moving thing?", "Motion is spent once per vocabulary. Here that budget goes entirely to `live`."],
            ["Does the layout box stay fixed?", "An indicator that grows or shrinks nudges its neighbours on every update."],
            ["Is the semantic colour a claim you can defend?", "If red can appear on a healthy metric, red has stopped being a signal."],
            ["Is it the existing motif, or a new one?", "A new proportion treatment costs every user a fresh decoding. Reuse MeterBar at a new thickness instead."],
          ]}
        />
      </DocSection>
    </>
  );
}
