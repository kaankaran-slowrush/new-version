/* =============================================================================
   Patterns barrel
   =============================================================================
   Composed from primitives, but still product-agnostic — a DataTable does not
   know it is showing runs, and an EmptyState does not know it is a session list.
   Product knowledge lives in components/app/.

   These are where cross-page visual consistency actually comes from. If two
   pages build their own card or their own empty state, the system has already
   started drifting.
   ============================================================================= */

export * from "./activity-strip";
export * from "./bar-list";
export * from "./card";
export * from "./card-rail";
export * from "./code-block";
export * from "./copy-field";
export * from "./data-table";
export * from "./empty-state";
export * from "./first-run";
export * from "./error-state";
export * from "./filter-pills";
export * from "./glass-panel";
export * from "./meter-bar";
export * from "./section-header";
export * from "./sparkline";
export * from "./stat-tile";
export * from "./status-mark";
export * from "./toolbar";
