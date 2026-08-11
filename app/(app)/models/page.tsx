import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/patterns";
import { buttonVariants } from "@/components/primitives";
import { ShowroomView } from "./showroom-view";
import { BALANCE, MODELS } from "@/lib/mock/models";

export const metadata = { title: "Models" };

export default function ModelsPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Catalogue"
        title="Models"
        description="Every model available to this workspace, with what it costs per run. Agents route to these — you only need to pick one when you want to override Auto."
        action={
          <Link
            href="/models/all"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            Browse all {MODELS.length} models
            <ArrowRight />
          </Link>
        }
      />
      <ShowroomView models={MODELS} balance={BALANCE} />
    </main>
  );
}
