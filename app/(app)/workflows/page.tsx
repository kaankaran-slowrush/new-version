import Link from "next/link";
import { ArrowRight, ChevronRight, GitBranch, TriangleAlert } from "lucide-react";
import { Badge, buttonVariants } from "@/components/primitives";
import { Icon } from "@/components/primitives/icon";
import {
  Card,
  FirstRun,
  SectionHeader,
  Sparkline,
  StatusMark,
} from "@/components/patterns";
import { MODALITY_ICON, MODALITY_LABEL } from "@/lib/icons";
import type { Modality } from "@/lib/mock/agents";

export const metadata = { title: "Workflows" };

/* =============================================================================
   Workflows — SHELL ONLY, deliberately.
   =============================================================================
   The node canvas is explicitly out of scope: the user excluded it from the
   redesign ("workflow canvas dışında geri kalanına müdahale edebiliriz"), and
   designing a graph editor blind — without knowing whether the real one is a
   node canvas, a linear chain, or something else — would produce a confident
   guess that is worse than an honest gap.

   So this page ships the real chrome (header, list, templates, states) and says
   plainly where the boundary is. A reviewer should never mistake an unbuilt
   surface for a designed one.

   ---------------------------------------------------------------------------
   THE CHAIN IS THE CONTENT, and it used to be hidden in a string. Every row said
   "Product shot → caption → post" as a name and then reported "3 steps" beside
   it — the same fact twice, once unparseable and once uninformative. A workflow's
   one distinguishing property is which modalities it moves through and in what
   order, so that is now rendered as the row's own visual: typed chips with the
   arrows between them. It reads at a glance, it is the same shape in the list and
   in the templates, and it means "3 steps" no longer needs saying.

   WHAT A WORKFLOW LIST ACTUALLY HAS TO ANSWER. Three questions, and the old rows
   answered one:
     what does it do    → the chain
     how does it fire   → the trigger, which the page header promised ("by API or
                          schedule") and no row disclosed
     is it healthy      → status plus a run trend, because "128 runs" total says
                          nothing about whether it ran this week
   ============================================================================= */

type Workflow = {
  id: string;
  name: string;
  chain: Modality[];
  trigger: string;
  runs: number;
  perDay: number[];
  status: "live" | "idle" | "error";
  updated: string;
};

/* NAMES SAY WHAT IT IS FOR; THE CHAIN SAYS WHAT IT DOES. The first fixture here
   was called "Product shot → caption → post", which meant the row printed its own
   pipeline twice — once as an unparseable string in the title and once as typed
   chips underneath. Splitting the two jobs is the whole point of the chips. */
const WORKFLOWS: Workflow[] = [
  {
    id: "w1",
    name: "Daily product posts",
    chain: ["image", "text", "image"],
    trigger: "Schedule · weekdays 09:00",
    runs: 128,
    perDay: [4, 6, 5, 7, 6, 8, 7, 9, 6, 8, 7, 9, 8, 10],
    status: "live",
    updated: "2 days ago",
  },
  {
    id: "w2",
    name: "Bulk image upscale",
    chain: ["image", "image"],
    trigger: "API",
    runs: 41,
    perDay: [0, 0, 12, 9, 0, 0, 0, 6, 4, 0, 0, 8, 2, 0],
    status: "live",
    updated: "1 week ago",
  },
  {
    /* A workflow that has never run is a different object from one running daily,
       and the old row buried that in "0 runs" between two other numbers. */
    id: "w3",
    name: "Voiceover from script",
    chain: ["text", "audio"],
    trigger: "Manual",
    runs: 0,
    perDay: [],
    status: "idle",
    updated: "3 weeks ago",
  },
];

const TEMPLATES: { name: string; chain: Modality[]; blurb: string }[] = [
  {
    name: "Post with narration",
    chain: ["image", "text", "audio"],
    blurb: "Produce a post and its narration from one reference image.",
  },
  {
    name: "Script to finished cut",
    chain: ["text", "image", "video"],
    blurb: "Split a script into shots, generate each, then stitch.",
  },
  {
    name: "Batch background removal",
    chain: ["image", "image"],
    blurb: "Run one image operation across an uploaded set.",
  },
];

/* -----------------------------------------------------------------------------
   Chain — the typed pipeline, as a row of chips.

   Local to this page on purpose. It is used twice here and nowhere else yet;
   promoting it to `components/patterns` before a third caller exists would be
   inventing a shared abstraction from a single page's needs. If a third surface
   wants it, that is the moment it moves.

   The arrow is `aria-hidden` and the list is an `<ol>`: the order carries the
   meaning, so a screen reader has to get the sequence from the markup rather than
   from a glyph it cannot interpret.
   --------------------------------------------------------------------------- */
function Chain({ chain }: { chain: Modality[] }) {
  return (
    <ol className="flex min-w-0 flex-wrap items-center gap-1">
      {chain.map((m, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 ? (
            <ChevronRight aria-hidden className="size-3 shrink-0 text-ink-muted" />
          ) : null}
          <span className="flex items-center gap-1 rounded-md bg-surface-sunken px-1.5 py-0.5 text-xs text-ink-secondary [&_svg]:size-3">
            <Icon of={MODALITY_ICON[m]} />
            {MODALITY_LABEL[m]}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function WorkflowsPage() {
  const hasWorkflows = WORKFLOWS.length > 0;

  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Build"
        title="Workflows"
        description="Chain models and agents into a repeatable pipeline you can trigger by API or schedule."
      />

      {/* The honest boundary marker. */}
      <Card className="anim-rise stagger-2 mb-8 flex items-start gap-3 border-l-[3px] border-l-warning p-4">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
        <div>
          <p className="mb-1 text-sm font-semibold text-ink">
            The canvas editor is not designed in this kit
          </p>
          <p className="max-w-measure text-sm text-ink-secondary">
            Workflow editing is a graph-editor problem with its own interaction model
            and was scoped out. Everything around it — the list, templates, run
            status, empty states — uses the kit and is ready to port. Treat the
            editor itself as an open design question, not a missing file.
          </p>
        </div>
      </Card>

      {/* ---- FIRST VISIT: no list, because the templates below are the way in.
             Same reasoning as /agents. A "Your workflows" header over an
             invitation would be a weaker second copy of the template grid, and it
             would push the actual entry points down the page. The FirstRun here
             earns its place because — unlike agents — a workflow is a concept the
             reader may genuinely not have met, and the three steps are ordered:
             you cannot schedule a chain you have not built. ---- */}
      {hasWorkflows ? (
        <section className="anim-rise stagger-3 mb-12">
          <SectionHeader
            title="Your workflows"
            action={
              <span className={buttonVariants({ variant: "primary", size: "md" })}>
                <GitBranch />
                New workflow
              </span>
            }
          />

          <ul className="overflow-hidden rounded-2xl bg-surface shadow-sm">
            {WORKFLOWS.map((wf, i) => (
              <li
                key={wf.id}
                className={`px-5 py-4 ${i > 0 ? "border-t border-line-inner" : ""}`}
              >
                <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-sunken text-ink-secondary">
                    <GitBranch className="size-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {wf.name}
                    </p>
                    <div className="mt-1.5">
                      <Chain chain={wf.chain} />
                    </div>
                  </div>

                  {/* The trend, not the total. 128 runs says nothing about whether
                      it ran this week; the shape does. A workflow that has never
                      run gets a sentence instead of a flat line at zero, because a
                      zero-height sparkline reads as a rendering failure. */}
                  <div className="w-32 shrink-0">
                    {wf.perDay.length > 0 ? (
                      <>
                        <Sparkline
                          values={wf.perDay}
                          /* `bars` and not a line: these are counts per day, and
                             a bar sits on a real zero baseline — which matters
                             here because w2's zeros are the information. */
                          shape="bars"
                          aria-label={`${wf.name} runs per day over the last 14 days`}
                        />
                        <p className="tabular mt-1 text-xs text-ink-tertiary">
                          {wf.runs} runs · 14d
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-ink-tertiary">Never run</p>
                    )}
                  </div>

                  <div className="flex w-40 shrink-0 flex-col items-start gap-1.5">
                    <StatusMark
                      status={wf.status}
                      label={wf.status === "live" ? "Enabled" : "Paused"}
                      showLabel
                    />
                    <p className="text-xs text-ink-tertiary">{wf.trigger}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <FirstRun
          className="anim-rise stagger-3 mb-12"
          icon={<GitBranch />}
          title="Build your first workflow"
          description="A workflow is a chain you can run again — the same sequence of models, on new input, without retyping the brief."
          steps={[
            {
              title: "Pick a template",
              body: "Or start from an empty chain below.",
            },
            {
              title: "Chain the steps",
              body: "Each step's output is the next step's input.",
            },
            {
              title: "Give it a trigger",
              body: "A schedule, an API call, or run it by hand.",
            },
          ]}
          action={
            <span className={buttonVariants({ variant: "primary", size: "md" })}>
              <GitBranch />
              New workflow
            </span>
          }
        />
      )}

      <section className="anim-rise stagger-4">
        <SectionHeader
          title="Start from a template"
          description={
            <>
              Templates absorb what used to be a separate &ldquo;Workflow
              Templates&rdquo; page — one page, because browsing templates and
              browsing your own workflows are the same task at different starting
              points.
            </>
          }
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Card key={t.name} interactive className="flex flex-col p-4">
              <Badge variant="neutral" size="sm" className="mb-3 self-start">
                Template
              </Badge>
              {/* The chain replaces the arrow-string the name used to carry, so the
                  two lists describe a pipeline the same way. */}
              <Chain chain={t.chain} />
              <p className="mt-3 mb-1 text-sm font-semibold text-ink">{t.name}</p>
              <p className="mb-4 flex-1 text-sm text-ink-secondary">{t.blurb}</p>
              <Link
                href="#"
                className="flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline"
              >
                Use template
                <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
