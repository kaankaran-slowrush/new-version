"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  History,
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  Video,
} from "lucide-react";
import { CATEGORY_ICON } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import {
  Badge,
  Button,
  Input,
  Pill,
  SegmentedControl,
  Switch,
  buttonVariants,
} from "@/components/primitives";
import {
  ActivityStrip,
  Card,
  CardBody,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  MeterBar,
  EmptyState,
  FirstRun,
  StatusMark,
  Toolbar,
} from "@/components/patterns";
import {
  RUN_ACTIVITY,
  RUN_CATEGORY_MIX,
  type PlatformRun,
  type RunCategory,
  type RunStatus,
} from "@/lib/mock/platform";
import { cn } from "@/lib/cn";

/* =============================================================================
   Run history
   =============================================================================
   Ported from the production screen, with four deliberate changes. The originals
   are noted so a reviewer can see what moved and disagree if they want.

   1 · TOOLBAR CONTROLS RENAMED AND GROUPED.
       Production had five controls in one undifferentiated row, two of which named
       mechanisms rather than things: "Multiple Select" (→ **Category**, which is
       what it filters) and "Select download" (→ a plain **Export** action; a
       checkbox styled as a button reads as neither). Filters now cluster left,
       view controls right, so the row has a readable structure.

   2 · GRID VIEW NO LONGER RESERVES SPACE FOR MISSING PREVIEWS.
       In production, video and text runs render a large grey "No preview" box
       taking ~60% of the card. A card with nothing to show should be compact, not
       a placeholder-shaped hole — so those collapse to a dense form and only runs
       with real output get the large tile.

   3 · STATUS USES StatusMark (shape + colour), so completed/failed survive
       greyscale and a screenshot pasted into a ticket.

   4 · PAGE SIZE IS SELECTABLE. 34 pages with no rows-per-page control is a lot of
       clicking to answer "what happened this month".

   Kept as-is because it was right: the column set, the dual list/grid toggle
   (genuinely useful when outputs are visual), relative timestamps, per-row copy,
   and retry-on-failure.
   ============================================================================= */

const STATUS_META: Record<
  RunStatus,
  { mark: "success" | "error" | "live" | "idle"; label: string }
> = {
  completed: { mark: "success", label: "Completed" },
  failed: { mark: "error", label: "Failed" },
  running: { mark: "live", label: "Running" },
  queued: { mark: "idle", label: "Queued" },
};

const STATUS_FILTERS = [
  { value: "all", label: "All status" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "running", label: "Running" },
];

const CATEGORIES: RunCategory[] = [
  "Image to Image",
  "Image to Video",
  "Text to Video",
  "Text to Image",
  "Text to Speech",
];

export function RunHistoryView({
  runs,
  totalPages,
}: {
  runs: PlatformRun[];
  totalPages: number;
}) {
  const [view, setView] = React.useState<"list" | "grid">("list");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [categories, setCategories] = React.useState<RunCategory[]>([]);
  const [showApi, setShowApi] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(25);

  const filtered = runs.filter((run) => {
    if (status !== "all" && run.status !== status) return false;
    if (categories.length > 0 && !categories.includes(run.category)) return false;
    if (!showApi && run.viaApi) return false;
    if (query && !`${run.id} ${run.target}`.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  function toggleCategory(c: RunCategory) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  const mixTotal = RUN_CATEGORY_MIX.reduce((a, b) => a + b.runs, 0);
  /* FIVE categories against a four-segment maximum, so the two smallest roll into
     "Other". Doing this at the call site rather than inside MeterBar is deliberate:
     which rows are worth naming is an editorial judgement about this page, not
     something a proportion strip can decide. */
  const mixSorted = [...RUN_CATEGORY_MIX].sort((a, b) => b.runs - a.runs);
  const mixSegments = [
    ...mixSorted.slice(0, 3).map((m) => ({
      label: m.category,
      value: (m.runs / mixTotal) * 100,
      valueLabel: `${m.runs}`,
    })),
    {
      label: "Other",
      value: (mixSorted.slice(3).reduce((a, b) => a + b.runs, 0) / mixTotal) * 100,
      valueLabel: `${mixSorted.slice(3).reduce((a, b) => a + b.runs, 0)}`,
    },
  ];
  const activeDays = RUN_ACTIVITY.filter((d) => d.value > 0).length;
  const busiest = RUN_ACTIVITY.reduce(
    (a, b) => (b.value > a.value ? b : a),
    { label: "", value: 0 },
  );

  return (
    <>
      {/* ---- Header block: what these 30 days were made of.
             ONE temporal graphic and ONE compositional graphic, sharing a single
             accent ramp. The rows below get nothing — this is already the densest
             table in the product (category badges, status marks, a per-row copy
             button and a per-row retry button), so its visual budget is spent.
             Aggregates earn space here because the aggregate IS the answer to the
             question the page asks. ---- */}
      <Card className="anim-rise stagger-1 mb-6">
        <CardBody>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <ActivityStrip
              days={RUN_ACTIVITY}
              summary={`${activeDays} of ${RUN_ACTIVITY.length} days active · busiest ${busiest.value} runs on ${busiest.label} · quiet since ${RUN_ACTIVITY[RUN_ACTIVITY.length - 3]?.label}`}
              aria-label={`Run activity over the last ${RUN_ACTIVITY.length} days: ${activeDays} days had runs, the busiest was ${busiest.value} runs on ${busiest.label}, and there was a four-day gap in late July.`}
            />
            <div>
              <MeterBar
                segments={mixSegments}
                thickness="thick"
                label="What these 30 days were made of"
                showValue={`${mixTotal} runs`}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Toolbar takes explicit left/right slots, which is what enforces the
          filters-left / view-controls-right split rather than leaving it to
          whatever order children happen to be written in. */}
      <Toolbar
        aria-label="Run list filters and view"
        className="anim-rise stagger-2 mb-4"
        left={
          <>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID or model…"
              aria-label="Search runs"
              startIcon={<Search />}
              className="w-56"
            />
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-(--control-height-md) rounded-md bg-surface-sunken px-2.5 text-sm text-ink-secondary"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </>
        }
        right={
          <>
            <Switch checked={showApi} onCheckedChange={setShowApi} label="API calls" />
            <Button variant="secondary" size="md" startIcon={<Download />}>
              Export
            </Button>
            <SegmentedControl
              label="View mode"
              size="sm"
              value={view}
              onValueChange={(v) => setView(v as "list" | "grid")}
              options={[
                { value: "list", label: "List", icon: <List /> },
                { value: "grid", label: "Grid", icon: <LayoutGrid /> },
              ]}
            />
          </>
        }
      />

      {/* Category is a multi-select, so it gets its own row of pills rather than
          hiding N selections behind a control labelled "Multiple Select". */}
      <div className="anim-rise stagger-2 mb-6 flex flex-wrap items-center gap-2">
        <span className="eyebrow text-ink-tertiary">
          Category
        </span>
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            size="sm"
            variant={categories.includes(c) ? "active" : "outline"}
            startIcon={<Icon of={CATEGORY_ICON[c]} />}
            onClick={() => toggleCategory(c)}
          >
            {c}
          </Pill>
        ))}
        {categories.length > 0 && (
          <Button variant="link" onClick={() => setCategories([])}>
            Clear
          </Button>
        )}
      </div>

      {/* TWO DIFFERENT EMPTIES, and they must not share a treatment. A workspace
          that has never run anything needs to be taught what this page will show;
          a filter that excluded everything needs a way back, and being taught
          would be insulting because the user already knows what runs are. */}
      {runs.length === 0 ? (
        <FirstRun
          icon={<History />}
          title="Every run will be listed here"
          description="Each generation this workspace executes lands here with its status, duration and cost — including the ones that fail."
          steps={[
            { title: "Start a session", body: "Any agent, any modality." },
            { title: "It appears as it runs", body: "Live, then completed or failed." },
            { title: "Filter and export", body: "By status, category, or model." },
          ]}
          action={
            <Link
              href="/agents"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Start a session
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No runs match these filters"
          description="Widen the status or category filters, or clear the search."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery("");
            setStatus("all");
            setCategories([]);
          }}
        />
      ) : view === "list" ? (
        <Card variant="footerStrip" className="anim-rise stagger-3 overflow-hidden">
          <DataTable>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>ID</DataTableHeadCell>
                <DataTableHeadCell>Category</DataTableHeadCell>
                <DataTableHeadCell>Model</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell sortDirection="desc">Time</DataTableHeadCell>
                <DataTableHeadCell align="right">Duration</DataTableHeadCell>
                <DataTableHeadCell align="right">Cost</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {filtered.map((run) => {
                const meta = STATUS_META[run.status];
                return (
                  <DataTableRow key={run.id}>
                    <DataTableCell numeric>
                      <span className="inline-flex items-center gap-1.5">
                        {run.id}
                        <button
                          aria-label={`Copy run ID ${run.id}`}
                          className="text-ink-tertiary transition-colors duration-(--duration-fast) hover:text-ink"
                        >
                          <Copy className="size-3" />
                        </button>
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      <Badge variant="neutral" size="sm">
                        <Icon of={CATEGORY_ICON[run.category]} />
                        {run.category}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell primary>
                      <span className="inline-flex items-center gap-1.5">
                        <a href="#" className="text-accent-ink hover:underline">
                          {run.target}
                        </a>
                        {run.isPipeline && (
                          <span className="font-mono text-2xs text-ink-tertiary">
                            pipeline
                          </span>
                        )}
                      </span>
                    </DataTableCell>
                    <DataTableCell>
                      <span className="inline-flex items-center gap-2">
                        <StatusMark status={meta.mark} label={meta.label} showLabel />
                        {run.status === "failed" && (
                          <button
                            aria-label={`Retry run ${run.id}`}
                            title="Retry"
                            className="text-ink-tertiary transition-colors duration-(--duration-fast) hover:text-ink"
                          >
                            <RefreshCw className="size-3" />
                          </button>
                        )}
                      </span>
                    </DataTableCell>
                    <DataTableCell meta>{run.relativeTime}</DataTableCell>
                    <DataTableCell numeric align="right">
                      {run.durationLabel ?? "—"}
                    </DataTableCell>
                    <DataTableCell numeric align="right">
                      ${run.costUsd.toFixed(3)}
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
            </DataTableBody>
          </DataTable>
        </Card>
      ) : (
        <div className="anim-rise stagger-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((run) => {
            const meta = STATUS_META[run.status];
            return (
              <Card
                key={run.id}
                interactive
                className={cn("overflow-hidden", run.hasPreview ? "p-0" : "p-4")}
              >
                {/* Only runs with real output get the large tile. Everything else
                    is compact — no placeholder-shaped hole. */}
                {run.hasPreview && (
                  <div className="relative aspect-square bg-surface-sunken">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_25%_20%,oklch(94%_0.03_202)_0%,transparent_55%),linear-gradient(160deg,oklch(97.5%_0.005_75),oklch(88.5%_0.008_75))]"
                    />
                    <Badge
                      variant="neutral"
                      size="sm"
                      className="absolute top-2.5 left-2.5 bg-surface/85"
                    >
                      <Icon of={CATEGORY_ICON[run.category]} />
                      {run.category}
                    </Badge>
                  </div>
                )}

                <div className={cn(run.hasPreview && "p-4")}>
                  {!run.hasPreview && (
                    <Badge variant="neutral" size="sm" className="mb-2.5">
                      <Icon of={CATEGORY_ICON[run.category]} />
                      {run.category}
                    </Badge>
                  )}
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">{run.target}</p>
                    <StatusMark status={meta.mark} label={meta.label} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="tabular font-mono text-2xs text-ink-tertiary">
                      {run.id} · {run.relativeTime}
                    </span>
                    <span className="tabular font-mono text-2xs text-ink-secondary">
                      ${run.costUsd.toFixed(3)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination + page size. The production screen had 34 pages and no way to
          ask for more rows. */}
      <div className="anim-rise stagger-4 mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-ink-tertiary">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-(--control-height-sm) rounded-md bg-surface-sunken px-2.5 text-sm text-ink"
          >
            {[25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button variant="ghost" size="sm" iconOnly aria-label="First page" disabled>
            <ChevronsLeft />
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Previous page" disabled>
            <ChevronLeft />
          </Button>
          {[1, 2, 3].map((p) => (
            <Button
              key={p}
              variant={p === 1 ? "primary" : "ghost"}
              size="sm"
              aria-current={p === 1 ? "page" : undefined}
              className="tabular min-w-9"
            >
              {p}
            </Button>
          ))}
          <span className="px-1 text-ink-tertiary">…</span>
          <Button variant="ghost" size="sm" className="tabular min-w-9">
            {totalPages}
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Next page">
            <ChevronRight />
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Last page">
            <ChevronsRight />
          </Button>
        </nav>
      </div>
    </>
  );
}
