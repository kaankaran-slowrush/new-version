import Link from "next/link";
import { ArrowRight, Cpu, Paperclip, Plus, Sparkles, UserPlus } from "lucide-react";
import {
  MODALITY_ICON,
  MODALITY_LABEL,
  VISIBILITY_ICON,
  VISIBILITY_LABEL,
  VISIBILITY_TONE,
} from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import { ProceduralCover } from "@/components/app/procedural-cover";
import { ModelCard } from "@/components/app/model-card";
import { Avatar, Badge, Pill, buttonVariants } from "@/components/primitives";
import {
  ActivityStrip,
  BarList,
  Card,
  CardRail,
  CardBody,
  CardHeader,
  CardTitle,
  MeterBar,
  SectionHeader,
  Sparkline,
  StatTile,
  StatusMark,
} from "@/components/patterns";
import { describeSeries } from "@/lib/series";
import { AGENTS, FLEET } from "@/lib/mock/agents";
import { BALANCE, MODELS } from "@/lib/mock/models";
import { RUN_ACTIVITY } from "@/lib/mock/platform";
import {
  PRODUCTION_BY_MODALITY,
  RECENT_ARTIFACTS,
  SESSIONS,
  STARTER_PROMPTS,
} from "@/lib/mock/sessions";

export const metadata = { title: "Home" };

/* =============================================================================
   Home
   =============================================================================
   UX NOTES
   --------
   • THE LEAD CHANGED, DELIBERATELY. This page used to open with fleet status,
     on the argument that a returning operator asks "is everything still
     running". That is a true thing about operators and it was the wrong thing to
     lead with, because it describes the product as infrastructure to babysit.
     The actual proposition is: describe something once, get the image, the
     video and the voice back from one conversation. A page that never SHOWS
     that spends its most valuable position restating what a status page already
     says.

     So the hierarchy is now: the promise, then proof that it happened here,
     then the agents that do it, then — genuinely demoted — the operational
     numbers. Status did not get deleted; it got put where its actual urgency
     sits, which for a healthy workspace is "further down".

   • THE HERO IS THE PRODUCT, NOT A PICTURE OF IT. The composer surface here is
     the real composer's geometry, tokens and modality chips, rendered inert. A
     hero that invents its own illustration teaches the user a layout they will
     never see again; this one teaches them the control they are about to use.

   • WHY THE ARTIFACT STRIP IS PROOF AND NOT DECORATION. Every tile is a real
     turn from a real session, with its own prompt and modality — including a
     FAILED one. A wall of flawless output reads as a marketing page. One
     failure in the strip is what makes the other five credible, and it is
     honest about a product where generation genuinely fails sometimes.

   • VISUALISATION IS LOAD-BEARING HERE. The modality tiles are the one place
     that answers "what does this workspace actually make", and the answer is a
     shape, not a number: image and video climbing, TEXT FALLING. That decline is
     invisible in a total and obvious in a sparkline.

   • Entrance is staggered in reading order (`.anim-rise` + `.stagger-*`), which
     self-gates on prefers-reduced-motion.
   ============================================================================= */

/* The rail reads from RECENT_ARTIFACTS, not from TURNS.

   It used to build itself out of five `TURNS.find()` calls, and two of them —
   "the first video" and "the failed one" — resolved to the SAME turn, because the
   first video in that fixture is the failed one. The strip rendered the same tile
   twice with a duplicate React key, and claimed in a comment to be showing six
   turns when the fixture only had five. TURNS describes one session; this rail
   claims the whole workspace. Different question, different fixture. */

/* Curated, not dumped: available models only, no Auto. A rail of peers is exactly
   the context that would imply Auto is a model rather than a routing policy —
   the reason the showroom pulls it out of the grid too. */
const SHOWCASE_MODELS = MODELS.filter(
  (m) => !m.isAuto && m.status === "available",
).slice(0, 8);

const QUICK_ACTIONS = [
  { label: "Provision model", href: "/models", icon: <Cpu /> },
  { label: "New workflow", href: "/workflows", icon: <Plus /> },
  { label: "Invite teammate", href: "/settings/workspace", icon: <UserPlus /> },
];

export default function HomePage() {
  const erroredCount = FLEET.filter((f) => f.status === "error").length;
  const runningCount = FLEET.filter((f) => f.status === "live").length;
  const idleCount = FLEET.filter((f) => f.status === "idle").length;
  const spentPct = Math.round((BALANCE.spentThisMonth / BALANCE.allowance) * 100);
  const monthOverMonthPct = Math.abs(
    Math.round(
      ((BALANCE.spentThisMonth - BALANCE.spentLastMonth) / BALANCE.spentLastMonth) * 1000,
    ) / 10,
  );
  const totalMade = PRODUCTION_BY_MODALITY.reduce((a, b) => a + b.total, 0);
  /* A brand-new workspace has none of these. Every derived value below has to
     survive that, because the alternative is not a bad-looking page — it is a
     500. `SESSIONS[0]!` and a seedless `reduce()` both threw on an empty
     workspace until this was added. */
  const firstSession = SESSIONS[0];
  const hasHistory = RECENT_ARTIFACTS.length > 0;
  /* A BRAND-NEW WORKSPACE INVERTS THE HIERARCHY. The active-account layout leads
     with proof and demotes the agents; with nothing produced, proof is an empty
     rail and "0 · 0 · 0" tiles, which draws attention to the absence rather than
     to the product. So on a first visit the agents take the focal position, the
     history sections disappear entirely rather than rendering empty, and the hero
     offers starter prompts where the artifacts would have been. */
  const isNewWorkspace = totalMade === 0 && RECENT_ARTIFACTS.length === 0;
  const activeDays = RUN_ACTIVITY.filter((d) => d.value > 0).length;
  const busiestDay = RUN_ACTIVITY.reduce(
    (a, b) => (b.value > a.value ? b : a),
    { label: "", value: 0 },
  );

  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      {/* ================= HERO — the promise, and the control that delivers it = */}
      <section className="anim-rise stagger-1 pt-6 pb-16">
        <div className="mb-5 flex items-center gap-2.5">
          <StatusMark status="live" label="Studio Agent is live" showLabel />
          <span className="text-xs text-ink-secondary">
            {isNewWorkspace
              ? "Ready when you are"
              : `${totalMade.toLocaleString()} things made in this workspace`}
          </span>
        </div>

        {/* `text-wrap: balance` comes from the global h1–h6 rule in globals.css,
            not from a class here — which matters on a two-line display heading,
            because it is what stops the break landing after a single orphaned word
            at odd viewport widths. Do not add `text-balance`; it is already on. */}
        {/* THE HOOK NAMES THE DELIVERABLES, not the technology.
            It was "Describe it once. / Get all four back." — accurate, and it made
            the reader do the arithmetic: four of what? "The shoot, the cut, the
            voice" is the same promise with the abstraction removed, and it is the
            product's own vocabulary (the agent cards already say "shoot a product
            image, write its caption, voice it, then animate it"). It is also a
            triple, which is the oldest rhythm there is for making a claim land.

            "Brief it once" rather than "describe": the buyer here runs creative
            operations, and a brief is the unit of work they already think in.

            The triple drops "and" on purpose. Asyndeton is the whole reason the
            rhythm lands — "the shoot, the cut, the voice" is three beats, while
            "and the voice" turns it into a shopping list. "Ship" went with it: the
            verb is already in the line above, so repeating it cost a third line at
            40px for nothing.

            30ch is NOT a measure — it is line-break shaping, and the cap is what
            holds the triple on one line. The one arbitrary width left in the
            product, deliberately. */}
        <h1 className="mb-4 max-w-[30ch] text-3xl text-ink lg:text-4xl">
          Brief it once.
          <span className="block text-ink-secondary">
            The shoot, the cut, the voice.
          </span>
        </h1>
        <p className="mb-8 max-w-measure text-base leading-relaxed text-ink-secondary">
          Four modalities in one conversation, each turn building on the last — the
          image becomes the video, the caption becomes the voiceover. No pipeline to
          assemble, and no files to carry between four different tools.
        </p>

        {/* ---- The composer, inert.
               `surface-veil` and NOT `.glass`: this is content, and glass is
               licensed for persistent navigational chrome only. It still floats,
               because the veil sits over the ambient layer. ---- */}
        <div
          className="surface-veil panel-edge mb-4 rounded-3xl p-2"
          /* --shadow-composer, matching the real composer this replicates. It casts
             UPWARD as well as down, which is what a surface sitting above page
             content should do — and it was the one thing the replica had not
             copied. Inline because it is a token reference, not a scale step. */
          style={{ boxShadow: "var(--shadow-composer)" }}
        >
          <div className="flex items-start gap-3 px-3 pt-3 pb-2">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-accent-ink" />
            <p className="min-w-0 flex-1 text-base text-ink-tertiary">
              A ceramic cup on a linen backdrop, morning light — then write the
              caption and voice it.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
            <div className="flex flex-wrap items-center gap-1">
              {/* Real Pills. These were hand-rolled spans reproducing Pill's
                  geometry by hand, which is how a control drifts from the component
                  it is imitating. `tabIndex={-1}` because the composer is inert
                  here — a hero should not put five fake stops in the tab order
                  before the actual CTA. */}
              {PRODUCTION_BY_MODALITY.map(({ modality }, i) => (
                <Pill
                  key={modality}
                  size="md"
                  variant={i === 0 ? "active" : "default"}
                  startIcon={<Icon of={MODALITY_ICON[modality]} />}
                  tabIndex={-1}
                >
                  {MODALITY_LABEL[modality]}
                </Pill>
              ))}
              <span className="ml-1 grid size-8 place-items-center rounded-full text-ink-tertiary [&_svg]:size-4">
                <Paperclip />
              </span>
            </div>

            <Link
              href={firstSession ? `/agents/${firstSession.id}` : "/agents"}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start making
              <ArrowRight />
            </Link>
          </div>
        </div>

        {/* ---- FIRST VISIT: starter prompts where the artifacts would be.
               Not tips and not a tour — real prompts, one per modality. The
               blank-page problem is the actual obstacle on a generative product,
               and the fix is a filled page rather than instructions about how to
               fill one. ---- */}
        {isNewWorkspace ? (
          <div>
            <p className="eyebrow mb-3 text-ink-secondary">Start with one of these</p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {STARTER_PROMPTS.map((sp) => (
                <Card
                  key={sp.id}
                  interactive
                  elevation="sm"
                  className="flex flex-col gap-2 p-4"
                >
                  <span className="flex items-center gap-1.5 eyebrow text-ink-tertiary [&_svg]:size-3.5">
                    <Icon of={MODALITY_ICON[sp.modality]} />
                    {sp.label}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-secondary">
                    {sp.prompt}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        ) : (
        <>
        {/* ---- Proof: real turns, including one that failed.
               This is the page's art, and it used to be its thinnest surface — a
               96px cover on a 160px tile, while the Models showroom ran the SAME
               idea at 160px. It now uses the shared ProceduralCover, so five tiles
               no longer share two hard-coded gradients.

               It has a title and controls now. Titleless AND controlless meant an
               unlabelled group of links with no affordance for a mouse that cannot
               scroll horizontally. ---- */}
        <CardRail
          title="Made here recently"
          href="/agents"
          aria-label="Recent output from this workspace"
          meta={
            <p className="eyebrow hidden text-ink-secondary sm:block">
              {RECENT_ARTIFACTS.length} across {new Set(RECENT_ARTIFACTS.map((a) => a.sessionId)).size} sessions
            </p>
          }
        >
          {RECENT_ARTIFACTS.map((artifact) => {
            const failed = artifact.state === "failed";
            const running = artifact.state === "generating";
            return (
              <Link
                key={artifact.id}
                href={`/agents/${artifact.sessionId}`}
                className="w-64 shrink-0"
              >
                <Card interactive elevation="sm" className="h-full overflow-hidden p-0">
                <ProceduralCover
                  seed={artifact.id}
                  modality={artifact.modality}
                  height="lg"
                  tone={failed ? "danger" : "accent"}
                >
                  {/* A job still in flight gets the sheen the session canvas uses
                      for the same state, so "working" looks the same everywhere. */}
                  {running ? (
                    <span
                      aria-hidden
                      className="anim-sheen absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.55)_48%,transparent_66%)] bg-[length:220%_100%] bg-[position:130%_0]"
                    />
                  ) : null}
                  <Badge
                    variant="neutral"
                    size="sm"
                    className="absolute top-2.5 left-2.5 bg-surface/85"
                  >
                    <Icon of={MODALITY_ICON[artifact.modality]} />
                    {MODALITY_LABEL[artifact.modality]}
                  </Badge>
                  {/* The failure rides on the cover rather than sitting in the
                      footer. It is the one thing about a tile worth knowing before
                      you read the prompt. */}
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-surface/85 px-2 py-1">
                    {failed ? (
                      <StatusMark status="error" label="Failed" showLabel />
                    ) : running ? (
                      <StatusMark status="live" label="Generating" showLabel />
                    ) : (
                      <span className="tabular font-mono text-2xs text-ink-secondary">
                        {artifact.duration ?? artifact.relativeTime}
                      </span>
                    )}
                  </span>
                </ProceduralCover>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
                    {artifact.prompt}
                  </p>
                </div>
                </Card>
              </Link>
            );
          })}
        </CardRail>
        </>
        )}
      </section>

      {/* Sections below describe history. On a first visit they render nothing at
          all rather than rendering empty: a card reading "0" with a flat line is
          not a neutral placeholder, it is a statement that this product has done
          nothing for you. Absence is quieter than an empty chart. */}
      {!isNewWorkspace && (
        <>
      {/* ================= PICK BACK UP ========================================
             The fastest path back to value for a returning visitor, so it sits
             immediately under the promise. SESSIONS already carried title, preview,
             relativeTime, visibility and lastArtifact and NONE of it was rendered —
             the page imported the fixture only to read `SESSIONS[0].id` as a link
             target. Deliberately compact: this is a resume affordance, not a second
             showcase, and it must not compete with the proof strip above it. ---- */}
      <section className="anim-rise stagger-2 mb-12">
        <SectionHeader
          title="Continue where you left off"
          action={
            <Link href="/agents" className="text-accent-ink hover:underline">
              All sessions
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SESSIONS.slice(0, 2).map((session) => {
            const VisibilityGlyph = VISIBILITY_ICON[session.visibility];
            return (
              <Link key={session.id} href={`/agents/${session.id}`}>
                <Card interactive elevation="sm" className="h-full p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={session.agentMonogram}
                      initials={session.agentMonogram}
                      size="md"
                      shape="square"
                      tone="accent"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                          {session.title}
                        </p>
                        {/* The last thing this session produced. Text sessions get
                            no glyph: every session produces text, so marking it
                            would mark everything and distinguish nothing. */}
                        {session.lastArtifact && session.lastArtifact !== "text" ? (
                          <span className="shrink-0 text-ink-tertiary [&_svg]:size-3.5">
                            <Icon of={MODALITY_ICON[session.lastArtifact]} />
                          </span>
                        ) : null}
                      </div>
                      <p className="line-clamp-1 text-sm text-ink-tertiary">
                        {session.preview}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <Badge variant={VISIBILITY_TONE[session.visibility]} size="sm">
                          <Icon of={VisibilityGlyph} />
                          {VISIBILITY_LABEL[session.visibility]}
                        </Badge>
                        <span className="tabular font-mono text-2xs text-ink-tertiary">
                          {session.relativeTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= WHAT THIS WORKSPACE MAKES ============================ */}
      {/* Peer sections keep an even gap. The bigger gaps on this page are placed
          where the REGISTER changes — after the hero (promise ends), and before
          Workspace (the page stops describing the product and starts describing
          your account). Air as punctuation, not as decoration. */}
      <section className="anim-rise stagger-3 mb-12">
        <SectionHeader
          title="What this workspace makes"
          /* The action slot supplies `text-sm text-ink-secondary`, so a plain
             stat node carries no classes of its own. */
          action={<span>last 14 days</span>}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTION_BY_MODALITY.map((row) => {
            const first = row.perDay[0]!;
            const last = row.perDay[row.perDay.length - 1]!;
            const falling = last < first;
            const changePct = Math.abs(Math.round(((last - first) / first) * 100));
            return (
              /* `p-0` + `overflow-hidden` so the chart can reach the card's own
                 edge. A chart that stops short of it reads as a widget dropped into
                 a container; one that runs into the corner radius reads as part of
                 the card. That is most of what "solid" means here. */
              <Card
                key={row.modality}
                interactive
                elevation="sm"
                className="overflow-hidden p-0"
              >
                <div className="p-4 pb-3">
                  {/* ONE label, not two. This was an icon-and-name row followed by a
                      StatTile whose own eyebrow read "PRODUCED" — two label lines for
                      one number, and the second was redundant besides: the section
                      above is already called "What this workspace makes". */}
                  <StatTile
                    label={
                      <span className="flex items-center gap-1.5 [&_svg]:size-3.5">
                        <Icon of={MODALITY_ICON[row.modality]} />
                        {MODALITY_LABEL[row.modality]}
                      </span>
                    }
                    value={row.total.toLocaleString()}
                    delta={`${changePct}%`}
                    deltaDirection={falling ? "down" : "up"}
                  />
                </div>

                {/* The tile's whole reason to exist: text is FALLING while the
                    others climb, which the total cannot show. */}
                <Sparkline
                  values={row.perDay}
                  shape="area"
                  size="md"
                  tone={falling ? "warning" : "accent"}
                  aria-label={describeSeries(
                    `${MODALITY_LABEL[row.modality]} produced per day`,
                    row.perDay,
                    { window: "last 14 days" },
                  )}
                />
              </Card>
            );
          })}
        </div>
      </section>

        </>
      )}

      {/* ================= THE AGENTS ==========================================
             On a first visit this is the FOCAL section — it sits directly under
             the hero, because "which of these do I open" is the only question a
             new user actually has. On an established account it stays where it is,
             below the work already in progress. ---- */}
      <section className={`anim-rise mb-16 ${isNewWorkspace ? "stagger-2" : "stagger-4"}`}>
        <SectionHeader
          title="Agents"
          description="Every session starts with one. Both chain image, video, audio and text inside the same conversation."
          action={
            <Link href="/agents" className="text-accent-ink hover:underline">
              All agents
            </Link>
          }
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {AGENTS.map((agent) => (
            <Card key={agent.id} interactive elevation="sm" className="p-5">
              <div className="mb-3 flex items-start gap-3">
                {/* Was a hand-rolled span reproducing Avatar's geometry. */}
                <Avatar
                  name={agent.name}
                  initials={agent.monogram}
                  size="lg"
                  shape="square"
                  tone="accent"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-ink">
                      {agent.name}
                    </h3>
                    <StatusMark
                      status={agent.status}
                      label={agent.status === "live" ? "Live" : "Unavailable"}
                    />
                  </div>
                  <p className="text-sm text-ink-tertiary">{agent.tagline}</p>
                </div>
              </div>

              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-secondary">
                {agent.description}
              </p>

              {/* The capability badges that used to sit here are gone. They listed
                  the same four modalities for BOTH agents — my own comment said so —
                  while the mix below names those same four AND their proportions.
                  One row strictly contained the other, so the outer one was pure
                  clutter. Removing it is the single biggest tidy on this card. */}
              <div className="mb-4">
                <MeterBar
                  segments={agent.outputMix.map((m) => ({
                    label: m.label,
                    value: m.share,
                    valueLabel: `${m.share}%`,
                  }))}
                  thickness="thick"
                />
              </div>

              <div className="flex items-end justify-between gap-4 border-t border-line-inner pt-3.5">
                <div className="min-w-0 flex-1">
                  <p className="eyebrow mb-1.5 text-ink-tertiary">
                    {agent.runsThisWeek} runs this week
                  </p>
                  <Sparkline
                    values={agent.runsPerDay}
                    shape="bars"
                    size="xs"
                    tone={agent.runsTrendPct >= 0 ? "accent" : "warning"}
                    aria-label={describeSeries(`${agent.name} runs`, agent.runsPerDay, {
                      unit: "runs",
                      window: "last 14 days",
                    })}
                  />
                </div>
                <Link
                  href={firstSession ? `/agents/${firstSession.id}` : "/agents"}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  Open
                  <ArrowRight />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= WHAT YOU CAN RUN =====================================
             The second rail. Discovery sits below the things the workspace already
             owns — you look at the catalogue after you have looked at your own work,
             not before it. Reuses ModelCard at showroom density, which is the most
             visual card in the kit; nothing new was built for this. ---- */}
      {/* stagger-5 twice, deliberately: the scale stops at 5 and both of these are
          below the fold at any viewport. The stagger exists to lead the eye down the
          FIRST screen, not to keep counting. */}
      <section className="anim-rise stagger-5 mb-16">
        <CardRail
          title="Models you can run"
          href="/models"
          aria-label="Models available to this workspace"
          meta={
            <p className="eyebrow hidden text-ink-secondary sm:block">
              {MODELS.length} in the catalogue
            </p>
          }
        >
          {SHOWCASE_MODELS.map((model) => (
            <ModelCard key={model.id} model={model} density="showroom" />
          ))}
        </CardRail>
      </section>

      {/* ================= OPERATIONS ===========================================
             Fleet status and spend answer "is everything still running" and "what
             am I paying". Neither is a question a first-time visitor has, and a
             fleet table with no rows beside a balance that has never moved is pure
             chrome. It collapses to a single line until there is something to
             report. ---- */}
      {isNewWorkspace ? (
        <section className="anim-rise stagger-4">
          <p className="text-sm text-ink-secondary">
            Nothing running yet. Once you deploy an agent, fleet status and spend
            appear here.{" "}
            <Link href="/workflows" className="text-accent-ink hover:underline">
              Browse workflows
            </Link>
          </p>
        </section>
      ) : (
      <>
      <section className="anim-rise stagger-5">
        <SectionHeader
          title="Workspace"
          description="What is running right now, and what this month has cost."
          action={
            <p>
              {runningCount} running · {idleCount} idle
              {erroredCount > 0 && (
                <>
                  {" · "}
                  <span className="text-danger">{erroredCount} needs attention</span>
                </>
              )}
            </p>
          }
        />

        {/* A full-width band leading the section. It is the only texture on this
            page that is neither a line nor a bar — everything else is a sparkline
            or a meter — which is exactly why it breaks the visual monotony. It also
            gives the section a lead instead of opening straight into a list.

            The four-day gap in late July is the point: an outage is invisible in a
            total and unmissable in a strip of hollow cells. */}
        <Card className="mb-4">
          <CardBody>
            <ActivityStrip
              days={RUN_ACTIVITY}
              summary={`${activeDays} of ${RUN_ACTIVITY.length} days active · busiest ${busiestDay.value} runs on ${busiestDay.label} · quiet the last two days`}
              aria-label={`Generation activity over the last ${RUN_ACTIVITY.length} days: ${activeDays} days had runs, the busiest was ${busiestDay.value} on ${busiestDay.label}, and there was a four-day gap in late July.`}
            />
          </CardBody>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Fleet, compressed into rows. It was seven horizontally-scrolling
              cards; as a supporting module a dense list is the right density,
              and the failing row is easier to spot in a column than in a scroller. */}
          <Card className="p-0">
            <CardHeader className="px-5 pt-5">
              <CardTitle>Fleet status</CardTitle>
              <Link
                href="/workflows"
                className="text-sm text-accent-ink hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardBody className="px-0 pt-0 pb-2">
              <ul>
                {FLEET.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-4 px-5 py-2.5 transition-colors duration-(--duration-fast) hover:bg-surface-hover"
                  >
                    <StatusMark
                      status={entry.status}
                      label={
                        entry.status === "live"
                          ? "Running"
                          : entry.status === "idle"
                            ? "Standby"
                            : "Failing"
                      }
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {entry.name}
                    </span>
                    <span className="hidden w-24 shrink-0 sm:block">
                      <Sparkline
                        values={entry.runsPerDay}
                        shape="bars"
                        size="xs"
                        tone={
                          entry.status === "error"
                            ? "danger"
                            : entry.successRate < 90
                              ? "warning"
                              : "accent"
                        }
                        aria-label={describeSeries(`${entry.name} runs`, entry.runsPerDay, {
                          unit: "runs",
                          window: "last 14 days",
                        })}
                      />
                    </span>
                    <span className="tabular w-12 shrink-0 text-right font-mono text-2xs text-ink-tertiary">
                      {entry.status === "idle" ? "—" : `${entry.successRate}%`}
                    </span>
                    {/* No meter here any more. Success rates on this fleet run
                        89–100%, so seven bars all sat within the top tenth of their
                        track and rendered as seven identical lines — a chart whose
                        every value looks the same is not showing anything. The
                        figure beside it already carries the number, and the
                        sparkline carries the shape. */}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This month</CardTitle>
              <Badge variant={spentPct > 90 ? "danger" : "neutral"} size="sm">
                {spentPct}% used
              </Badge>
            </CardHeader>
            <CardBody className="pt-0">
              <StatTile
                className="mb-5"
                label="Remaining balance"
                value={`$${BALANCE.remaining.toFixed(2)}`}
                delta={`${monthOverMonthPct}%`}
                deltaDirection="down"
                caption={`of $${BALANCE.allowance.toLocaleString()} · $${BALANCE.spentThisMonth.toFixed(2)} spent`}
                meter={{
                  value: 100 - spentPct,
                  tone: spentPct > 90 ? "warning" : "accent",
                  "aria-label": "Allowance remaining",
                }}
              />
              <BarList
                scale="total"
                scaleLabel={`share of $${BALANCE.spentThisMonth.toFixed(2)} spent`}
                items={BALANCE.byModel.map((row) => ({
                  label: row.name,
                  value: row.cost,
                  valueLabel: `$${row.cost.toFixed(2)}`,
                }))}
              />
            </CardBody>
          </Card>
        </div>

        {/* Lowest priority: the occasional infrastructure errands. */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={buttonVariants({ variant: "ghost", size: "md" })}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </section>
      </>
      )}
    </main>
  );
}
