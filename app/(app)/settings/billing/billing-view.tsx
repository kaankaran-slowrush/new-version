"use client";

import * as React from "react";
import { CreditCard, Plus, Ticket, TriangleAlert, Wallet } from "lucide-react";
import {
  Badge,
  Button,
  Input,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "@/components/primitives";
import {
  Card,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  EmptyState,
  MeterBar,
  Sparkline,
  FirstRun,
  SectionHeader,
} from "@/components/patterns";
import { describeSeries } from "@/lib/series";
import type { Transaction } from "@/lib/mock/platform";
import { cn } from "@/lib/cn";

/* =============================================================================
   Billing
   =============================================================================
   Ported from the production screen. The structure was right — balance up top,
   alert threshold beside it, tabbed detail below — so it is kept. Four changes:

   1 · THE BALANCE FIGURE IS NOT GREEN.
       Production renders $844.36 in success-green. Green is this system's *success*
       colour; spending it on "here is a number" both dilutes the semantic and
       implies the balance is healthy — which at $0.18 remaining it very much is
       not. The figure is ink at display size, and colour appears ONLY when the
       balance is actually below the alert threshold (then warning).

   2 · "ALL KEYS ENCRYPTED" MOVED OUT.
       It sat under the balance figure, where it reads as a non-sequitur — it is a
       trust claim about API keys, not about money. It belongs on the API Keys page.

   3 · THE THRESHOLD IS INLINE-EDITABLE.
       Production showed "Configured Threshold: $1" as a label plus a "Configure
       Alerts" button that opens something to change one number. One number does
       not need a round trip.

   4 · TABS ARE REAL TABS.
       The control in production looks like a segmented control but behaves as tabs
       over panels — so it should *be* tabs semantically (arrow-key navigation,
       proper panel association), which is what the primitive gives.
   ============================================================================= */

const KIND_LABEL: Record<Transaction["kind"], string> = {
  "top-up": "Top-up",
  usage: "Usage",
  coupon: "Credit",
};

export function BillingView({
  balance,
  threshold,
  transactions,
  paymentMethods,
}: {
  balance: {
    remaining: number;
    allowance: number;
    spentThisMonth: number;
    /** Oldest → newest. Six points, for the spend sparkline. */
    spendByMonth: { label: string; value: number }[];
    /** DESCENDING by value — MeterBar's segment ramp is monotonic with size. */
    spendByModality: { label: string; value: number }[];
  };
  threshold: number;
  transactions: Transaction[];
  paymentMethods: { id: string; brand: string; last4: string; expiry: string; isDefault: boolean }[];
}) {
  const [thresholdValue, setThresholdValue] = React.useState(String(threshold));
  const low = balance.remaining <= Number(thresholdValue || 0);
  const usedPct = Math.min(
    100,
    Math.round((balance.spentThisMonth / balance.allowance) * 100),
  );

  return (
    <>
      <Card className="anim-rise stagger-2 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-sunken text-ink-secondary">
              <Wallet className="size-5" />
            </span>
            <SectionHeader
              level={3}
              as="h2"
              title="Balance"
              description="Available for generations"
              className="mb-0"
            />
          </div>

          <div className="text-right">
            {/* Ink, not green. Warning only when it genuinely is one. */}
            <p
              className={cn(
                "tabular font-mono text-3xl font-semibold",
                low ? "text-warning" : "text-ink",
              )}
            >
              ${balance.remaining.toFixed(2)}
            </p>
            {low && (
              <p className="mt-1 flex items-center justify-end gap-1.5 text-sm text-warning">
                <TriangleAlert className="size-3.5" />
                Below your ${thresholdValue} alert threshold
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-line-inner pt-5">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-ink-secondary">
              <span className="tabular font-mono font-semibold text-ink">
                ${balance.spentThisMonth.toFixed(2)}
              </span>{" "}
              spent this month
            </p>
            <p className="tabular text-sm text-ink-tertiary">
              {usedPct}% of ${balance.allowance.toLocaleString()} allowance
            </p>
          </div>
          <MeterBar
            value={usedPct}
            tone={usedPct > 90 ? "warning" : "accent"}
            thickness="thick"
            aria-label="Monthly allowance used"
          />

          {/* Six months of spend. `scale="zero"` is the default for bars and is
              MANDATORY for money — a truncated money bar is the classic chart
              crime, because the eye reads bar length as quantity. */}
          <div className="mt-6">
            <p className="eyebrow mb-2 text-ink-tertiary">Spend, last six months</p>
            <Sparkline
              values={balance.spendByMonth.map((m) => m.value)}
              shape="bars"
              size="sm"
              scale="zero"
              aria-label={describeSeries("Monthly spend", balance.spendByMonth.map((m) => m.value), {
                window: "last six months",
                format: (n) => `$${n.toFixed(2)}`,
              })}
            />
            <div className="mt-1.5 flex justify-between">
              {balance.spendByMonth.map((m) => (
                <span key={m.label} className="font-mono text-2xs text-ink-tertiary">
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* The second `segments` call site, and the more valuable one:
              composition of MONEY is a question people actually ask. Audio sits at
              $0.00 — it draws no span and still appears in the legend, because an
              absence must differ in form rather than in size. */}
          <div className="mt-6">
            <MeterBar
              segments={balance.spendByModality.map((m) => ({
                label: m.label,
                value: (m.value / balance.spentThisMonth) * 100,
                valueLabel: `$${m.value.toFixed(2)}`,
              }))}
              thickness="thick"
              label="Where it went"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line-inner pt-5">
          <SectionHeader
            level={3}
            title="Low balance alert"
            description="We email the workspace owner when the balance drops below this amount."
            className="mb-0 max-w-measure-narrow"
          />
          {/* Inline-editable — one number, no dialog. */}
          <label className="flex items-center gap-2 text-sm text-ink-secondary">
            Notify below
            <span className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-ink-tertiary">
                $
              </span>
              <Input
                value={thresholdValue}
                onChange={(e) => setThresholdValue(e.target.value)}
                inputMode="decimal"
                aria-label="Low balance threshold in dollars"
                className="w-24 pl-7 font-mono"
              />
            </span>
          </label>
        </div>
      </Card>

      <div className="anim-rise stagger-3 mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button variant="primary" size="md" startIcon={<Plus />}>
          Add balance
        </Button>
        <Button variant="ghost" size="md" startIcon={<Ticket />}>
          Redeem a coupon
        </Button>
      </div>

      <TabsRoot defaultValue="transactions" className="anim-rise stagger-4">
        <TabsList className="mb-5">
          <TabsTab value="transactions">Transactions</TabsTab>
          <TabsTab value="methods">Payment methods</TabsTab>
          <TabsTab value="address">Billing address</TabsTab>
        </TabsList>

        <TabsPanel value="transactions">
          {transactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              /* Says what will appear, not "none found". */
              description="Top-ups, credits, and monthly usage charges will appear here."
            />
          ) : (
            <Card variant="footerStrip" className="overflow-hidden">
              <DataTable>
                <DataTableHead>
                  <DataTableRow>
                    <DataTableHeadCell>Date</DataTableHeadCell>
                    <DataTableHeadCell>Description</DataTableHeadCell>
                    <DataTableHeadCell>Type</DataTableHeadCell>
                    <DataTableHeadCell>Method</DataTableHeadCell>
                    <DataTableHeadCell align="right">Amount</DataTableHeadCell>
                  </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                  {transactions.map((tx) => (
                    <DataTableRow key={tx.id}>
                      <DataTableCell meta>{tx.date}</DataTableCell>
                      <DataTableCell primary>{tx.description}</DataTableCell>
                      <DataTableCell>
                        <Badge variant="neutral" size="sm">
                          {KIND_LABEL[tx.kind]}
                        </Badge>
                      </DataTableCell>
                      <DataTableCell meta>{tx.method ?? "—"}</DataTableCell>
                      <DataTableCell numeric align="right">
                        {/* Sign carries the direction; colour is not needed and
                            would waste the semantic palette on bookkeeping. */}
                        {tx.amountUsd < 0 ? "−" : "+"}$
                        {Math.abs(tx.amountUsd).toFixed(2)}
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            </Card>
          )}
        </TabsPanel>

        <TabsPanel value="methods">
          {/* THE ONE FIRST-RUN CONDITION ON THIS PAGE, and it is not the balance.
              Every other readout here fills itself as the workspace runs — spend,
              invoices, the transaction ledger. A payment method is the single thing
              a new workspace has to actively do, and until it exists the balance
              cannot be topped up, so the page's whole purpose is blocked. The
              steps are ordered for the same reason: you cannot top up before there
              is a card, and you cannot spend before you top up. */}
          {paymentMethods.length === 0 ? (
            <FirstRun
              size="md"
              icon={<CreditCard />}
              title="Add a payment method to top up"
              description="Runs draw down a prepaid balance rather than billing per invoice, so the workspace needs a method on file before it can generate anything paid."
              steps={[
                { title: "Add a card", body: "Stored by our processor, never by us." },
                { title: "Top up", body: "Choose an amount, or set auto top-up." },
                { title: "Runs draw it down", body: "Each one prices before it starts." },
              ]}
              action={
                <Button variant="primary" size="md" startIcon={<Plus />}>
                  Add payment method
                </Button>
              }
            />
          ) : (
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <Card key={pm.id} className="flex items-center gap-4 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-sunken text-ink-secondary">
                  <CreditCard className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {pm.brand} ···· {pm.last4}
                  </p>
                  <p className="tabular text-sm text-ink-tertiary">
                    Expires {pm.expiry}
                  </p>
                </div>
                {pm.isDefault && (
                  <Badge variant="accent" size="sm">
                    Default
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </Card>
            ))}
            <Button variant="secondary" size="lg" startIcon={<Plus />}>
              Add payment method
            </Button>
          </div>
          )}
        </TabsPanel>

        <TabsPanel value="address">
          <Card className="max-w-xl">
            <div className="space-y-4">
              {[
                { id: "company", label: "Company", placeholder: "Acme Inc." },
                { id: "line1", label: "Address", placeholder: "123 Example Street" },
                { id: "city", label: "City", placeholder: "Istanbul" },
                { id: "vat", label: "VAT / Tax ID", placeholder: "Optional" },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    {field.label}
                  </label>
                  <Input id={field.id} placeholder={field.placeholder} />
                </div>
              ))}
              <Button variant="primary">Save address</Button>
            </div>
          </Card>
        </TabsPanel>
      </TabsRoot>
    </>
  );
}
