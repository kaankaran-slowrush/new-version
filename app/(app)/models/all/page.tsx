import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SectionHeader } from "@/components/patterns";
import { AllModelsView } from "./all-models-view";
import { MODELS, facetGroups, tagFacets } from "@/lib/mock/models";

export const metadata = { title: "All models" };

export default function AllModelsPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      {/* The repo has no breadcrumb component and only one other parent/child pair
          (which spans two route groups and hand-builds its own back link). This
          matches that treatment: a chevron plus the parent's name, not a generic
          "Back". Naming the destination is what makes it a wayfinding control
          rather than a synonym for the browser button. */}
      <Link
        href="/models"
        className="anim-rise stagger-1 mb-4 inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors duration-(--duration-fast) hover:text-ink [&_svg]:size-4"
      >
        <ChevronLeft />
        Models showroom
      </Link>

      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Catalogue"
        title="All models"
        description={`Search and filter all ${MODELS.length} models. Counts are against the whole catalogue, so a facet reading zero means nothing here has it.`}
      />

      {/* Facets are computed on the server from the full catalogue — one source, so
          a count can never disagree with the grid beside it. */}
      <AllModelsView
        models={MODELS}
        facets={facetGroups(MODELS)}
        tags={tagFacets(MODELS)}
      />
    </main>
  );
}
