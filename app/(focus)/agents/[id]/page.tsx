import { notFound } from "next/navigation";
import { SessionWorkspace } from "@/components/app/session-workspace";
import { AGENTS } from "@/lib/mock/agents";
import { SESSIONS, TURNS } from "@/lib/mock/sessions";

/* The session workspace is a FOCUS MODE: it renders its own header and
   deliberately has no app topbar (see SessionWorkspace's UX notes). Every
   fixture session resolves to the same turn set — there is no data layer here. */

export function generateStaticParams() {
  return SESSIONS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = SESSIONS.find((s) => s.id === id);
  return { title: session?.title ?? "Session" };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = SESSIONS.find((s) => s.id === id);
  if (!session) notFound();

  const agent = AGENTS.find((a) => a.id === session.agentId) ?? AGENTS[0];
  /* A workspace with no agents deployed cannot render a session. `AGENTS[0]!`
     asserted otherwise and threw. */
  if (!agent) notFound();

  return <SessionWorkspace session={session} agent={agent} turns={TURNS} />;
}
