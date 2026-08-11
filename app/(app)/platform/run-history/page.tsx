import { SectionHeader } from "@/components/patterns";
import { RunHistoryView } from "./run-history-view";
import { PLATFORM_RUNS, RUN_TOTAL_PAGES } from "@/lib/mock/platform";

export const metadata = { title: "Run history" };

export default function RunHistoryPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Platform"
        title="Run history"
        description="Every model execution in this workspace, with its status, duration and cost."
      />
      <RunHistoryView runs={PLATFORM_RUNS} totalPages={RUN_TOTAL_PAGES} />
    </main>
  );
}
