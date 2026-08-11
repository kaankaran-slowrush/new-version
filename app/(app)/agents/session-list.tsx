"use client";

import * as React from "react";
import Link from "next/link";
import { MODALITY_ICON, VISIBILITY_ICON, VISIBILITY_LABEL, VISIBILITY_TONE } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import { Badge } from "@/components/primitives";
import { EmptyState, FilterPills, SectionHeader } from "@/components/patterns";
import type { Agent } from "@/lib/mock/agents";
import type { SessionSummary } from "@/lib/mock/sessions";

/* =============================================================================
   SessionList
   =============================================================================
   UX NOTES
   --------
   • ONE UNIFIED LIST, filtered — not a tab per agent. With two agents, per-agent
     tabs would create two half-empty lists and force a navigation decision with
     no payoff. A filter row is cheap and keeps "all my recent work" as the
     default view, which is what people actually want.

   • VISIBILITY IS SHOWN IN THE ROW. Whether a session is private, shared with the
     workspace, or on a public link is consequential enough that a user should
     never have to open it to find out. Icon + label, not colour alone.

   • The media-type glyph tells you what the session last produced, so a user can
     find "the one where I made the video" without reading titles.
   ============================================================================= */

export function SessionList({
  sessions,
  agents,
}: {
  sessions: SessionSummary[];
  agents: Agent[];
}) {
  const [filter, setFilter] = React.useState("all");

  const items = [
    { value: "all", label: "All" },
    ...agents.map((a) => ({ value: a.id, label: a.name })),
  ];

  const visible =
    filter === "all" ? sessions : sessions.filter((s) => s.agentId === filter);

  /* THE FIRST VISIT OMITS THIS SECTION ENTIRELY, and that is the doctrine rather
     than a shortcut. EmptyState names two acceptable treatments for a section with
     no rows, and the first one — omit it — is right here for a reason the second
     is not: the page already carries the thing that fills this list. Two agent
     cards sit directly above, each with its own "Start session" button. A
     "Your sessions" header over an invitation to start one would be a second,
     weaker copy of what the reader just looked at, and it would push the actual
     entry points further up and out of the way.

     So a brand-new workspace sees the agent cards as the whole page. That is the
     onboarding: not a panel explaining how to begin, but a page on which the only
     thing present is the beginning. */
  if (sessions.length === 0) return null;

  return (
    <section className="anim-rise stagger-3">
      <SectionHeader
        title="Your sessions"
        action={
          <FilterPills
            items={items}
            value={filter}
            onValueChange={setFilter}
            aria-label="Filter sessions by agent"
          />
        }
      />

      {visible.length === 0 ? (
        /* Reached ONLY by filtering, now that the never-had-any case returns above.
           So this is a recovery state, not an onboarding one: the reader knows what
           a session is and needs the way back to the ones they have. */
        <EmptyState
          title="No sessions with this agent yet"
          description="Try the other agent, or start one above."
          actionLabel="Show all sessions"
          onAction={() => setFilter("all")}
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-surface shadow-sm">
          {visible.map((session, i) => {
            const VisibilityGlyph = VISIBILITY_ICON[session.visibility];
            return (
              <li key={session.id}>
                <Link
                  href={`/agents/${session.id}`}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors duration-(--duration-fast) hover:bg-surface-hover ${
                    i > 0 ? "border-t border-line-inner" : ""
                  }`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-semibold text-accent-ink">
                    {session.agentMonogram}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {session.title}
                      </span>
                      {/* Text artifacts get no glyph on purpose: every session
                          produces text, so marking it would mark everything and
                          distinguish nothing. Only the visual/audio modalities are
                          worth a thumbnail hint here. */}
                      {session.lastArtifact && session.lastArtifact !== "text" && (
                        <span className="shrink-0 text-ink-tertiary">
                          <Icon
                            of={MODALITY_ICON[session.lastArtifact]}
                            className="size-3.5"
                          />
                        </span>
                      )}
                    </span>
                    <span className="line-clamp-1 block text-sm text-ink-tertiary">
                      {session.preview}
                    </span>
                  </span>

                  <Badge
                    variant={VISIBILITY_TONE[session.visibility]}
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Icon of={VisibilityGlyph} />
                    {VISIBILITY_LABEL[session.visibility]}
                  </Badge>

                  <span className="tabular w-16 shrink-0 text-right font-mono text-2xs text-ink-tertiary">
                    {session.relativeTime}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
