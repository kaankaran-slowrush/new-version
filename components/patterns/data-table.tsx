import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

/* =============================================================================
   DataTable — presentational table shell. No data logic of any kind.
   =============================================================================

   Composition, not configuration: there is no `columns` prop, because the
   moment a table takes a column config it starts owning rendering decisions
   (cell formatters, widths, sort state) that belong to the feature. Build rows
   in JSX; this file owns nothing but the look.

     <DataTable stickyHeader hoverRows>
       <DataTableHead>
         <DataTableRow>
           <DataTableHeadCell>Model</DataTableHeadCell>
           <DataTableHeadCell numeric sortDirection="desc">Calls</DataTableHeadCell>
         </DataTableRow>
       </DataTableHead>
       <DataTableBody>
         <DataTableRow>
           <DataTableCell>Sonnet</DataTableCell>
           <DataTableCell numeric>12,904</DataTableCell>
         </DataTableRow>
       </DataTableBody>
     </DataTable>

   `sortDirection` is a DISPLAY prop. It draws the caret and sets
   `aria-sort` — it does not sort, subscribe, or call anything. Wire the click to
   your own state via the cell's `onClick`.

   UX NOTES
   --------
   • WIDE CONTENT SCROLLS IN ITS OWN CONTAINER. The wrapper is
     `overflow-x-auto`, so a 12-column table never makes the page body scroll
     sideways — which would drag the nav and every other section off-screen to
     read one number.
   • Headers are 12px uppercase tracked `ink-muted`: the weakest ink on the
     page. A header row in strong ink competes with the data, and the data is
     the reason the table exists. Uppercase + tracking gives it presence
     without weight.
   • SEPARATION IS A TOP HAIRLINE PER ROW, never zebra striping. Stripes add a
     second alternating background the eye has to filter out on every scan, and
     they fight the hover state for the same channel. `border-t` on each row
     means the first row needs no rule (the header already ended) and the last
     needs no closing rule (the container edge does that).
   • NUMERIC COLUMNS ARE RIGHT-ALIGNED AND `.tabular`. Right alignment puts the
     ones digits in a column so magnitude is comparable at a glance, and tabular
     figures stop a live-updating cell from re-measuring the whole column.
   • Hover is opt-in (`hoverRows`) and should only be on when rows are actually
     targets. A row that lights up but does nothing is a lie about affordance.
   • `stickyHeader` needs an opaque background on the header cells or rows scroll
     through it — that is applied here, not left to the caller. It also needs a
     bounded-height scroll container to have anything to stick to.
   ============================================================================= */

const dataTableVariants = cva(
  [
    /* The wrapper, not the table: the scroll boundary must be an ancestor. */
    "w-full overflow-x-auto overscroll-x-contain",
  ],
  {
    variants: {
      surface: {
        /* Sits directly on a Card's padding. */
        plain: "",
        /* Standalone: its own opaque object. Concentric-safe inside a card. */
        panel: "panel-edge rounded-xl bg-surface shadow-sm",
      },
      density: {
        /* Cell padding is applied through descendant selectors so a caller
           switches density in one place instead of on every cell. */
        comfortable: "[&_td]:py-3 [&_th]:py-2.5",
        compact: "[&_td]:py-2 [&_th]:py-2",
      },
      hoverRows: {
        true: [
          "[&_tbody_tr]:transition-colors",
          "[&_tbody_tr]:duration-(--duration-fast)",
          "[&_tbody_tr]:ease-(--ease-out-quint)",
          "[&_tbody_tr:hover]:bg-surface-hover",
        ],
      },
      stickyHeader: {
        true: [
          "[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-(--z-sticky)",
          "[&_thead_th]:bg-surface",
        ],
      },
    },
    defaultVariants: { surface: "plain", density: "comfortable" },
  },
);

export interface DataTableProps
  extends React.ComponentPropsWithoutRef<"table">,
    VariantProps<typeof dataTableVariants> {
  /** Classes for the scroll wrapper. `className` targets the `<table>`. */
  wrapperClassName?: string;
  /** Visually hidden `<caption>`. Give every table a name. */
  caption?: React.ReactNode;
}

export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>(
  function DataTable(
    {
      className,
      wrapperClassName,
      surface,
      density,
      hoverRows,
      stickyHeader,
      caption,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <div
        className={cn(
          dataTableVariants({ surface, density, hoverRows, stickyHeader }),
          wrapperClassName,
        )}
      >
        <table
          ref={ref}
          className={cn(
            "w-full border-collapse text-left text-sm",
            /* Cells share one horizontal inset so columns line up with the
               surrounding card padding. */
            "[&_td]:px-4 [&_th]:px-4",
            className,
          )}
          {...props}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          {children}
        </table>
      </div>
    );
  },
);

export const DataTableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<"thead">
>(function DataTableHead({ className, ...props }, ref) {
  return <thead ref={ref} className={cn(className)} {...props} />;
});

export const DataTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<"tbody">
>(function DataTableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      /* The hairline lives on the row's top edge — see UX NOTES. */
      className={cn("[&>tr]:border-t [&>tr]:border-line-inner", className)}
      {...props}
    />
  );
});

export interface DataTableRowProps
  extends React.ComponentPropsWithoutRef<"tr"> {
  /** Persistent emphasis, e.g. the row a side panel is currently showing. */
  selected?: boolean;
  /** Recedes the row without hiding it — a disabled or archived record. */
  muted?: boolean;
}

export const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  DataTableRowProps
>(function DataTableRow({ className, selected, muted, ...props }, ref) {
  return (
    <tr
      ref={ref}
      data-selected={selected || undefined}
      aria-selected={selected || undefined}
      className={cn(
        selected && "bg-accent-soft",
        muted && "text-ink-tertiary",
        className,
      )}
      {...props}
    />
  );
});

const cellVariants = cva([], {
  variants: {
    numeric: {
      /* Right-aligned + tabular: the two halves of a comparable number column. */
      true: "tabular text-right",
    },
    /* Keeps a column from being squeezed to nothing by a long neighbour. */
    nowrap: {
      true: "whitespace-nowrap",
    },
  },
});

export interface DataTableHeadCellProps
  extends React.ComponentPropsWithoutRef<"th">,
    VariantProps<typeof cellVariants> {
  /**
   * DISPLAY ONLY. Draws the caret and sets `aria-sort`. This component does not
   * sort — pass `onClick` and own the state yourself.
   */
  sortDirection?: "asc" | "desc" | "none";
}

export const DataTableHeadCell = React.forwardRef<
  HTMLTableCellElement,
  DataTableHeadCellProps
>(function DataTableHeadCell(
  { className, numeric, nowrap, sortDirection, children, ...props },
  ref,
) {
  const sortable = sortDirection !== undefined;
  const SortIcon =
    sortDirection === "asc"
      ? ArrowUp
      : sortDirection === "desc"
        ? ArrowDown
        : ChevronsUpDown;

  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : sortable
              ? "none"
              : undefined
      }
      className={cn(
        "eyebrow text-ink-tertiary",
        "align-bottom whitespace-nowrap",
        cellVariants({ numeric, nowrap }),
        className,
      )}
      {...props}
    >
      {sortable ? (
        <span
          className={cn(
            "inline-flex items-center gap-1",
            /* The caret rides with the label, so it lands on the alignment
               edge the column already established. */
            numeric && "flex-row-reverse",
          )}
        >
          {children}
          <SortIcon
            className={cn(
              "size-3",
              sortDirection === "none" ? "text-ink-tertiary/60" : "text-ink-secondary",
            )}
            strokeWidth={2.25}
            aria-hidden
          />
        </span>
      ) : (
        children
      )}
    </th>
  );
});

export interface DataTableCellProps
  extends React.ComponentPropsWithoutRef<"td">,
    VariantProps<typeof cellVariants> {
  /** Row-identifying column: strongest ink, medium weight. */
  primary?: boolean;
  /** Supporting column: timestamps, owners, ids. */
  meta?: boolean;
}

export const DataTableCell = React.forwardRef<
  HTMLTableCellElement,
  DataTableCellProps
>(function DataTableCell(
  { className, numeric, nowrap, primary, meta, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(
        /* Three ink levels available per row so a scan has an entry point:
           primary (the name) → default (values) → meta (when/who). */
        "align-middle text-ink-secondary",
        primary && "font-medium text-ink",
        meta && "text-xs text-ink-tertiary",
        cellVariants({ numeric, nowrap }),
        className,
      )}
      {...props}
    />
  );
});

export { dataTableVariants };
