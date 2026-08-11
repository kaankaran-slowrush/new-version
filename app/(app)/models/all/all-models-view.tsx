"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ModelCard } from "@/components/app/model-card";
import { Button, Checkbox, Input, Pill } from "@/components/primitives";
import { EmptyState } from "@/components/patterns";
import { MODALITIES, MODALITY_LABEL } from "@/lib/icons";
import type { FacetGroup, FacetOption, ModelEntry } from "@/lib/mock/models";
import { cn } from "@/lib/cn";

/* =============================================================================
   All Models — search, facets, grid
   =============================================================================

   THE PRODUCT'S FIRST FILTER SIDEBAR, and that needs saying out loud because both
   `lib/docs-nav.ts` and `app/docs/layout.tsx` state in writing that the app
   deliberately has no sidebar.

   That rule was about NAVIGATION. The app's wayfinding is the topbar, and adding a
   nav rail would have meant two competing answers to "where am I". A facet rail is
   not wayfinding — it is page-scoped controls that only exist while you are on this
   page, and it disappears when you leave. Different job, so the rule holds and this
   is not an exception to it. The distinction is recorded in /docs/ux/chrome.

   COUNTS ARE AGAINST THE FULL CATALOGUE, NOT THE CURRENT RESULTS. A facet reading 0
   tells you "nothing here has this", which is information worth having. Recomputing
   against the filtered set would make every unselected option read 0 the moment you
   tick anything — which tells you nothing and makes the sidebar look broken. This is
   also what production does.

   A ZERO-COUNT FACET STAYS VISIBLE AND GOES DISABLED. Hiding it would mean the
   sidebar silently changes shape as data changes, and a reader could never learn
   "this catalogue has no 4K models" — they would just never see the option.

   NO PAGINATION. 28 results fit; a page-size control and fake page numbers would be
   chrome pretending there is a problem. (run-history has pagination because 34 pages
   of runs is real.)
   ============================================================================= */

type Selection = Record<string, string[]>;

const MODALITY_FACET: FacetGroup = {
  id: "capability",
  title: "Modality",
  options: [],
};

export function AllModelsView({
  models,
  facets,
  tags,
}: {
  models: ModelEntry[];
  facets: FacetGroup[];
  tags: FacetOption[];
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Selection>({});

  const toggle = (groupId: string, value: string) =>
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const out = { ...prev, [groupId]: next };
      if (next.length === 0) delete out[groupId];
      return out;
    });

  const clearAll = () => {
    setSelected({});
    setQuery("");
  };

  const activeCount =
    Object.values(selected).reduce((n, v) => n + v.length, 0) + (query ? 1 : 0);

  /* Presentational filtering. Every group is AND across groups, OR within a group —
     the standard faceted-search contract: narrowing by two different dimensions
     should intersect, narrowing by two values of one dimension should widen. */
  const q = query.trim().toLowerCase();
  const results = models.filter((m) => {
    if (
      q &&
      !`${m.name} ${m.vendor} ${m.description}`.toLowerCase().includes(q)
    ) {
      return false;
    }
    for (const [groupId, values] of Object.entries(selected)) {
      if (values.length === 0) continue;
      const hit = values.some((v) => {
        switch (groupId) {
          case "modality":
            return m.modality === v;
          case "capability":
            return m.capabilities.includes(v as ModelEntry["capabilities"][number]);
          case "displayStyle":
            return m.displayStyle === v;
          case "quality":
            return v === "4K" ? m.is4K === true : m.isFast === true;
          case "tag":
            return (m.tags ?? []).includes(v);
          default:
            return false;
        }
      });
      if (!hit) return false;
    }
    return true;
  });

  const groups: FacetGroup[] = [
    {
      ...MODALITY_FACET,
      id: "modality" as FacetGroup["id"],
      options: MODALITIES.map((mo) => ({
        value: mo,
        label: MODALITY_LABEL[mo],
        count: models.filter((m) => m.modality === mo).length,
      })),
    },
    ...facets,
    { id: "tag" as FacetGroup["id"], title: "Tags", options: tags },
  ];

  return (
    <>
      {/* ---- Search: full width, above everything. It is the fastest path when you
             already know the name, which is the majority of returning visits. ---- */}
      <div className="anim-rise stagger-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models by name, vendor, or what they do…"
          aria-label="Search models"
          startIcon={<Search />}
          size="lg"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        {/* ---- Facets. Page-scoped controls, not navigation — see the header. ---- */}
        <aside
          aria-label="Filter models"
          className="anim-rise stagger-3 lg:sticky lg:top-28 lg:self-start"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink [&_svg]:size-4">
              <SlidersHorizontal className="text-ink-secondary" />
              Filters
            </p>
            {activeCount > 0 ? (
              <Button variant="link" onClick={clearAll}>
                Clear all
              </Button>
            ) : null}
          </div>

          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="eyebrow mb-2 text-ink-tertiary">{group.title}</p>
                <ul className="space-y-0.5">
                  {group.options.map((opt) => {
                    const checked = (selected[group.id] ?? []).includes(opt.value);
                    /* A zero-count option is disabled, never removed. Ticking it
                       could only ever produce an empty grid, and hiding it would
                       mean nobody could learn the catalogue has none. */
                    const empty = opt.count === 0;
                    return (
                      <li key={opt.value}>
                        {/* Checkbox is a bare control by design (see its own docs),
                            so the label row is composed here — same structure as
                            webhooks-view's event list. */}
                        <label
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors duration-(--duration-fast)",
                            empty
                              ? "cursor-not-allowed opacity-45"
                              : "cursor-pointer hover:bg-surface-hover",
                          )}
                        >
                          <Checkbox
                            size="sm"
                            checked={checked}
                            disabled={empty}
                            onCheckedChange={() => toggle(group.id, opt.value)}
                          />
                          <span className="min-w-0 flex-1 truncate text-sm text-ink-secondary">
                            {opt.label}
                          </span>
                          <span className="tabular shrink-0 font-mono text-2xs text-ink-tertiary">
                            {opt.count}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* ---- Results ---- */}
        <div className="anim-rise stagger-3 min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="tabular text-sm text-ink-secondary">
              {results.length} of {models.length} models
            </p>
            {/* Active filters as dismissible chips. Without these, a filter set
                from the sidebar is invisible once you scroll the results, and
                "why is this list so short" becomes unanswerable. */}
            {Object.entries(selected).flatMap(([groupId, values]) =>
              values.map((v) => (
                <Pill
                  key={`${groupId}:${v}`}
                  size="sm"
                  variant="active"
                  onDismiss={() => toggle(groupId, v)}
                  dismissLabel={`Remove ${v} filter`}
                >
                  {groups.find((g) => g.id === groupId)?.options.find((o) => o.value === v)
                    ?.label ?? v}
                </Pill>
              )),
            )}
            {query ? (
              <Pill
                size="sm"
                variant="active"
                onDismiss={() => setQuery("")}
                dismissLabel="Clear search"
              >
                “{query}”
              </Pill>
            ) : null}
          </div>

          {results.length === 0 ? (
            <EmptyState
              framed
              title="No models match these filters"
              description="Every model in the catalogue was excluded. Loosen a filter or clear the search to see the full set again."
              actionLabel="Clear filters"
              onAction={clearAll}
            />
          ) : (
            /* NO price comparison bar in this grid. It is flat and mixed-modality,
               so there is no denominator that could honestly be declared — a video
               price against a text price on one axis is two different questions.
               The Showroom's rails are grouped, which is why they get bars. */
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((model) => (
                <ModelCard key={model.id} model={model} density="grid" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
