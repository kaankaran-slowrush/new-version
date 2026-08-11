import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MODALITY_ICON, MODALITY_LABEL } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import { Badge, buttonVariants } from "@/components/primitives";
import {
  Card,
  MeterBar,
  SectionHeader,
  Sparkline,
  StatTile,
  StatusMark,
} from "@/components/patterns";
import { describeSeries } from "@/lib/series";
import { SessionList } from "./session-list";
import { AGENTS } from "@/lib/mock/agents";
import { SESSIONS } from "@/lib/mock/sessions";

export const metadata = { title: "Agents" };

/* =============================================================================
   Agents hub
   =============================================================================
   UX NOTES
   --------
   • AGENT-PICKER FIRST, NOT SESSION-LIST FIRST. A session in this product can
     never start blank — you cannot open an empty chat box and type. Choosing an
     agent *is* the entry point, so it gets the focal position and the session
     list sits below it. Leading with the list would bury the only way to start.

   • WHY THE TWO CARDS ARE THIS LARGE. There are two agents. A tight grid of
     two cards in a 1180px column reads as an accident; letting them take real
     width reads as a deliberate choice between two things. This layout will need
     revisiting at ~6 agents, and becomes a filterable catalogue past ~12 — that
     is a different screen, not a smaller version of this one.

   • CAPABILITY CHIPS ARE ON THE CARD, not hidden in the session. The user should
     know what an agent can do *before* committing to a conversation with it —
     discovering a limit by hitting a failure is the thing capability transparency
     exists to prevent.

   • ONE ACCENT ACROSS BOTH AGENTS. They are differentiated by monogram and name
     only. Hashing agents to per-agent hues would introduce a second and third
     accent, and at scale produces a confetti catalogue.
   ============================================================================= */

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Agents"
        title="Start a session."
        description="Every session begins with an agent. Pick one — you can chain image, video, audio, and text inside the same conversation."
      />

      {/* ---- Focal: the two agent entry cards ---- */}
      <section className="anim-rise stagger-2 mb-14 grid gap-4 lg:grid-cols-2">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="flex flex-col p-6" elevation="sm">
            <div className="mb-4 flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-lg font-semibold text-accent-ink">
                {agent.monogram}
              </span>
              <div className="min-w-0 flex-1">
                <SectionHeader
                  level={3}
                  as="h2"
                  title={agent.name}
                  description={agent.tagline}
                  adornment={
                    <StatusMark
                      status={agent.status}
                      label={agent.status === "live" ? "Available" : "Unavailable"}
                    />
                  }
                  className="mb-0"
                />
              </div>
            </div>

            <p className="mb-5 flex-1 text-sm text-ink-secondary">{agent.description}</p>

            {/* Capability transparency: visible before the user commits. */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {agent.modalities.map((m) => (
                <Badge key={m} variant="neutral" size="md">
                  <Icon of={MODALITY_ICON[m]} />
                  {MODALITY_LABEL[m]}
                </Badge>
              ))}
            </div>

            {/* Was three hand-rolled value-above-label blocks, which inverted
                the kit's own hierarchy (the label should be the small quiet thing).
                StatTile brings `.tabular`, the four ink levels, and the
                arrow-plus-screen-reader-direction contract for free. */}
            <div className="mb-5 grid grid-cols-3 gap-5 border-t border-line-inner pt-4">
              <StatTile
                size="sm"
                label="Success rate"
                value={`${agent.successRate}%`}
                delta={`${Math.abs(agent.successTrendPct)}%`}
                deltaDirection={agent.successTrendPct >= 0 ? "up" : "down"}
              />
              <StatTile
                size="sm"
                label="Runs this week"
                value={agent.runsThisWeek}
                delta={`${Math.abs(agent.runsTrendPct)}%`}
                deltaDirection={agent.runsTrendPct >= 0 ? "up" : "down"}
              />
              {/* invertDelta: for latency, up is BAD. Without this the arrow would
                  be green while the agent got slower. */}
              <StatTile
                size="sm"
                label="Median latency"
                value={`${agent.medianLatencyMs}ms`}
                delta={`${Math.abs(agent.latencyTrendPct)}%`}
                deltaDirection={agent.latencyTrendPct >= 0 ? "up" : "down"}
                invertDelta
              />
            </div>

            {/* What it actually MAKES, as opposed to what it CAN make. The
                capability badges above say all four; this says the two agents use
                those four completely differently — Studio is an image shop,
                Atelier is a video shop. That is the fact that decides which one
                you open, and no number on this page carries it. */}
            <div className="mb-5">
              <MeterBar
                segments={agent.outputMix.map((m) => ({
                  label: m.label,
                  value: m.share,
                  valueLabel: `${m.share}%`,
                }))}
                thickness="thick"
                label="What it produces"
              />
            </div>

            {/* ONE graphic per card, spanning the full width — not one per metric.
                Three sparklines beside three tiles would be the same fact encoded
                twice over. Atelier's series sags to zero mid-window, so the ugly
                case is visible here by default. */}
            <div className="mb-5">
              <Sparkline
                values={agent.runsPerDay}
                shape="bars"
                size="sm"
                tone={agent.runsTrendPct >= 0 ? "accent" : "warning"}
                aria-label={describeSeries(`${agent.name} runs`, agent.runsPerDay, {
                  unit: "runs",
                  window: "last 14 days",
                })}
              />
              <p className="mt-1.5 text-2xs text-ink-tertiary">
                runs per day, last 14 days
              </p>
            </div>

            {/* Straight into the workspace — no intermediate "name your session"
                modal. The title is derived from the first prompt and editable
                afterwards, which is one less decision before any value. */}
            <Link
              href={SESSIONS[0] ? `/agents/${SESSIONS[0].id}` : "/agents"}
              className={buttonVariants({ variant: "primary", size: "xl" })}
            >
              Start session
              <ArrowRight />
            </Link>
          </Card>
        ))}
      </section>

      {/* ---- Session list. Client component only because filtering is local
             interaction state; the page itself stays a server component. ---- */}
      <SessionList sessions={SESSIONS} agents={AGENTS} />
    </main>
  );
}
