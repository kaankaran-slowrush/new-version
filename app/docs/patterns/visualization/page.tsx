import {
  ActivityStrip,
  BarList,
  MeterBar,
  Sparkline,
} from "@/components/patterns";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";
import { FLEET } from "@/lib/mock/agents";
import { BALANCE } from "@/lib/mock/models";
import { RUN_ACTIVITY } from "@/lib/mock/platform";
import { describeSeries } from "@/lib/series";

export const metadata = { title: "Micro-visualisation" };

const CLIFF = FLEET.find((f) => f.id === "f5") ?? FLEET[0];
const IDLE = FLEET.find((f) => f.id === "f3") ?? FLEET[0];
const SPARSE = FLEET.find((f) => f.id === "f4") ?? FLEET[0];
const HEALTHY = FLEET.find((f) => f.id === "f1") ?? FLEET[0];

export default function VisualizationDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Micro-visualisation"
        lede="Four marks, no charting library, no axes. Read them for shape, ranking and gaps — never for value. Every one of them is accompanied by its number, and that is not a style preference."
      />

      <DocSection
        title="The thesis"
        description="A graphic without axes is honest under one condition, and dishonest without it."
      >
        <p className="mb-4 text-ink-secondary">
          A micro-visualisation earns its place when it answers a question the number
          cannot — and it stays honest only while the number is <em>still on screen</em>.
          A delta arrow can say &ldquo;down 12%&rdquo;. It cannot say &ldquo;down, after
          four days at zero,&rdquo; and those two facts lead to completely different
          actions. Shape is what these marks add. Magnitude stays with the figure.
        </p>
        <p className="mb-4 text-ink-secondary">
          <strong className="text-ink">
            The rule, and it has no exceptions: never a sparkline without its number.
          </strong>{" "}
          These marks have no ticks, no gridlines, and deliberately no tooltips. The
          moment a reader has to read a value <em>off</em> the graphic, it has outgrown
          this kit — that is a charting dependency on a dedicated page, not an inline
          component.
        </p>

        <Example label="The same agent, with and without its history">
          <div className="flex flex-col gap-1.5">
            <p className="tabular font-mono text-xl text-ink">{CLIFF?.runs ?? 0}</p>
            <p className="text-2xs text-ink-tertiary">runs · 14 days</p>
          </div>
          <div className="w-56">
            <Sparkline
              values={CLIFF?.runsPerDay ?? []}
              shape="bars"
              tone="danger"
              aria-label={describeSeries("Access Reviewer runs", CLIFF?.runsPerDay ?? [], {
                unit: "runs",
                window: "last 14 days",
              })}
            />
            <p className="mt-1.5 text-2xs text-ink-tertiary">
              34 runs — and dead for four days
            </p>
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="A bar is honest when its denominator is declared"
        description="This is the distinction that decides which of the three bar-shaped things you want."
      >
        <p className="mb-4 text-ink-secondary">
          <Code>/docs/patterns/status</Code> forbids stacking meters to compare series,
          and that ban stands. But read what it is about. Four stacked meters are wrong
          because each bar has its <strong>own, undeclared denominator</strong> while
          sitting in a column that invites length comparison. The problem was never the
          mark — it was the missing scale.
        </p>
        <SpecTable
          columns={["Construction", "Denominator", "Verdict"]}
          rows={[
            ["Four stacked MeterBars", "Four, none stated", "STILL BANNED. The column invites a comparison the bars cannot support."],
            ["One MeterBar with `segments`", "Exactly one — the strip itself", "Sanctioned, for composition of a whole."],
            ["BarList", "One, printed above the rows", "Sanctioned, for ranking across categories."],
          ]}
        />
        <UXNote title="Which is why BarList is made OF MeterBars">
          <p>
            <Code>BarList</Code> does not draw a bar. It is a layout that supplies the
            one thing <Code>MeterBar</Code> structurally cannot know — a shared
            denominator — and then prints it. Every row is the same 3px strip the user
            already reads. There is no new mark to learn, which is what makes this an
            extension of the motif rather than a rival to it.
          </p>
        </UXNote>

        <Example label="BarList — the denominator is the first thing you read" stack>
          <BarList
            scale="total"
            scaleLabel={`share of $${BALANCE.spentThisMonth.toFixed(2)} spent`}
            items={BALANCE.byModel.map((r) => ({
              label: r.name,
              value: r.cost,
              valueLabel: `$${r.cost.toFixed(2)}`,
            }))}
          />
        </Example>

        <Example label="MeterBar segments — one strip, one whole, a named legend" stack>
          <MeterBar
            segments={BALANCE.spendByModality.map((m) => ({
              label: m.label,
              value: (m.value / BALANCE.spentThisMonth) * 100,
              valueLabel: `$${m.value.toFixed(2)}`,
            }))}
            thickness="thick"
            label="Where it went"
          />
        </Example>

        <UXNote title="Segmented mode drops role=progressbar, on purpose">
          <p>
            A composition has no <Code>valuenow</Code>. Announcing &ldquo;progress bar,
            40%&rdquo; for a four-way mix is simply wrong, so segmented mode is{" "}
            <Code>role=&quot;img&quot;</Code> with a composed label that names every
            part. This is the load-bearing accessibility difference between the two
            modes, not a detail.
          </p>
          <p>
            Segment colours are an <strong>ordered accent ramp</strong>, never
            categorical hues. &ldquo;Audio = red&rdquo; would spend the danger colour on
            a category name, and ordered lightness is what keeps the strip legible in
            greyscale. Callers pass segments in descending order so the ramp stays
            monotonic with size. Maximum four — roll the tail into one{" "}
            <Code>Other</Code> at the call site, as <Code>/platform/run-history</Code>
            does with its five categories.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The degenerate cases are specified, not incidental"
        description="These are the states a small graphic lies about most easily, so each one is a designed output."
      >
        <Example label="All zero · sparse · healthy">
          <div className="w-40">
            <Sparkline
              values={IDLE?.runsPerDay ?? []}
              shape="bars"
              aria-label={describeSeries("Incident Summarizer runs", IDLE?.runsPerDay ?? [], {
                unit: "runs",
                window: "last 14 days",
              })}
            />
            <p className="mt-1.5 text-2xs text-ink-tertiary">all zero → baseline, muted</p>
          </div>
          <div className="w-40">
            <Sparkline
              values={SPARSE?.runsPerDay ?? []}
              shape="bars"
              aria-label={describeSeries("Report Generator runs", SPARSE?.runsPerDay ?? [], {
                unit: "runs",
                window: "last 14 days",
              })}
            />
            <p className="mt-1.5 text-2xs text-ink-tertiary">sparse → visibly sparse</p>
          </div>
          <div className="w-40">
            <Sparkline
              values={HEALTHY?.runsPerDay ?? []}
              shape="bars"
              aria-label={describeSeries("Ticket Triage runs", HEALTHY?.runsPerDay ?? [], {
                unit: "runs",
                window: "last 14 days",
              })}
            />
            <p className="mt-1.5 text-2xs text-ink-tertiary">ordinary → ordinary</p>
          </div>
        </Example>

        <SpecTable
          columns={["Case", "What renders", "Why not the obvious thing"]}
          rows={[
            ["All values zero", "Baseline only, tone forced to `muted`", "A flat line at mid-height would read as \"steady\" — the opposite of the truth."],
            ["Fewer than 2 points", "Baseline only, same box height", "A two-point sparkline is the most confident-looking lie available. Same height so the row does not jump."],
            ["max === min, non-zero", "A genuinely flat line", "Flat IS the shape. Nothing to fix."],
            ["A zero row in a BarList", "Empty track, label and value intact", "A 1px stub lies about magnitude; a dropped row lies about existence."],
            ["A zero segment", "No span drawn, still in the legend", "An absence must differ in FORM, not in size."],
            ["A zero day in ActivityStrip", "Hollow outlined cell", "The palest fill would say \"a little activity\". No activity is not a little activity."],
          ]}
        />
      </DocSection>

      <DocSection
        title="Scale honesty"
        description="The single most common way a small chart lies is by not saying where its axis starts."
      >
        <SpecTable
          columns={["shape", "default scale", "Reason"]}
          rows={[
            ["bars", "zero", "A bar sits ON a baseline, so the eye reads its LENGTH as the quantity. A truncated money bar is the classic chart crime."],
            ["line / area", "extent", "Exaggerates by construction — which is what makes shape legible at 24px, and exactly why the adjacent number is mandatory."],
          ]}
        />
        <DontNote>
          <p>
            <strong>Never let a column of sparklines cover different windows.</strong>{" "}
            No component-level guard can catch this one — the marks are individually
            correct and the column is a lie by juxtaposition. Same window, every row.
          </p>
          <p>
            <strong>Minimum points:</strong> 7 for <Code>line</Code>/<Code>area</Code>,
            5 for <Code>bars</Code> (bars read as discrete quantities rather than a
            trajectory, so they survive fewer). Below that, use{" "}
            <Code>StatTile</Code>&apos;s delta — a three-point sparkline is a delta
            arrow wearing a confidence trick.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="ActivityStrip — for gaps, which is what a sparkline hides"
        description="At 30 points a sparkline turns a four-day outage into a smudge. A density strip makes it the loudest thing in the graphic."
      >
        <Example stack>
          <ActivityStrip
            days={RUN_ACTIVITY}
            summary="18 of 30 days active · busiest 61 runs on 28 Jul · four-day gap in late July"
            aria-label="Run activity over 30 days: 18 days had runs, busiest 61 on 28 July, with a four-day gap in late July."
          />
        </Example>
        <UXNote title="Two axis labels are permitted, and required">
          <p>
            The first and last date, at the two ends. A density strip with no start and
            end is undecodable, and pretending otherwise would be a worse violation than
            printing two dates. The <Code>summary</Code> prop then carries — visibly, for
            everyone — what a hover tooltip would have said. There is no{" "}
            <Code>title</Code> on the cells: a native tooltip across 30 targets is a
            hover lottery.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="One encoded column per table"
        description="The rule that stops this becoming chart junk."
      >
        <DontNote>
          <p>
            <strong>At most one column in a table gets a visual encoding</strong>, and it
            is the column people scan for outliers. Its denominator goes in the table&apos;s{" "}
            <Code>caption</Code> — the screen-reader-only caption is exactly the right
            home for a stated scale. The figure keeps a <strong>fixed width</strong>,
            because a bar&apos;s left edge is its baseline while the figure&apos;s right
            edge is the column&apos;s alignment edge, and only fixed widths let both hold.
          </p>
          <p>
            The failure mode here is social, not technical: one bar looks great, so the
            next change adds a second, and the table stops being scannable — which is the
            same harm the no-zebra-striping rule already guards against, arriving through
            a different door. <Code>/platform/run-history</Code> deliberately encodes{" "}
            <em>nothing</em> in its rows: it is the densest table in the product and its
            visual budget is already spent on badges, status marks and two row actions.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="When a number alone is better"
        description="The section worth reading before adding a graphic anywhere."
      >
        <ul className="mb-6 space-y-2.5 text-ink-secondary">
          <li>
            <strong className="text-ink">A single value with no history.</strong> There is
            no shape to show.
          </li>
          <li>
            <strong className="text-ink">Mixed-sign values.</strong> Billing transactions
            need a centre baseline and a diverging encoding this kit does not have. Sign
            plus <Code>.tabular</Code> is already correct.
          </li>
          <li>
            <strong className="text-ink">Comparisons nobody makes.</strong> Model prices
            are barred <em>within</em> a modality group because that is the only
            comparison anyone performs; a bar chart of a video price against a text price
            is two different questions on one axis.
          </li>
          <li>
            <strong className="text-ink">
              Anything that would be the third encoding of one fact.
            </strong>{" "}
            A badge and a status mark already carry it. A graphic that only confirms what
            the adjacent text says is chart junk no matter how small it is.
          </li>
        </ul>
        <UXNote title="Why these are hand-rolled, and stay hand-rolled">
          <p>
            All four are server components: no state, no effects, no measurement. The
            wrapper-div-plus-<Code>preserveAspectRatio=&quot;none&quot;</Code> trick
            exists specifically to avoid a <Code>ResizeObserver</Code>, which would drag
            a client boundary into a table row for a 60px graphic.
          </p>
          <p>
            <strong>
              If a real charting library lands later, these still do not go away.
            </strong>{" "}
            Adoption would be purely additive, because there is deliberately no chart
            abstraction here to collide with — no <Code>data</Code>+
            <Code>encoding</Code> prop pair, no scales object, no axis config, no theme
            adapter. Two things to write down now: nobody should &ldquo;unify&rdquo; by
            reimplementing <Code>Sparkline</Code> on top of it (that buys a client
            component and a bundle inside a server-rendered row), and any adoption
            checklist must remap its categorical palette onto these tokens — every
            charting library ships its own hues and will quietly introduce a second and
            third accent.
          </p>
        </UXNote>
      </DocSection>
    </>
  );
}
