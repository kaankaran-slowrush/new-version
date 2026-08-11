import { SectionHeader } from "@/components/patterns";
import { PlaygroundView } from "./playground-view";
import { MODELS } from "@/lib/mock/models";

export const metadata = { title: "Playground" };

/* Not seen in production — designed fresh. Flagged as a proposal rather than a
   port, so a reviewer knows this is the one page where we invented the IA. */
export default function PlaygroundPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Proposal · not ported from production"
        title="Playground"
        description="Run one model against one prompt, with its parameters exposed. For comparing models or tuning settings before committing them to an agent."
      />
      <PlaygroundView models={MODELS} />
    </main>
  );
}
