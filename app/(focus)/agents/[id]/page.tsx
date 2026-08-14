import { notFound } from "next/navigation";
import { SessionWorkspace } from "@/components/app/session-workspace";
import { AGENTS } from "@/lib/mock/agents";
import { SESSIONS, TURNS_BY_SESSION } from "@/lib/mock/sessions";

/* The session workspace is a FOCUS MODE: it renders its own header and
   deliberately has no app topbar (see SessionWorkspace's UX notes).

   EACH SESSION HAS ITS OWN TURNS. They all used to resolve to one set, and a
   comment here called that deliberate — but the session list advertises four
   different things and every row opened the same conversation, so the audio session
   showed a video render of a ceramic cup. See TURNS_BY_SESSION. */

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

  return <SessionWorkspace session={session} agent={agent} turns={TURNS_BY_SESSION[id] ?? []} />;
}
