import { SectionHeader } from "@/components/patterns";
import { BillingView } from "./billing-view";
import { BALANCE } from "@/lib/mock/models";
import {
  LOW_BALANCE_THRESHOLD,
  PAYMENT_METHODS,
  TRANSACTIONS,
} from "@/lib/mock/platform";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Settings"
        /* "Billings & Balance" → "Billing". One page, one noun. */
        title="Billing"
        description="Your balance, payment methods, and low-balance alerts."
      />
      <BillingView
        balance={BALANCE}
        threshold={LOW_BALANCE_THRESHOLD}
        transactions={TRANSACTIONS}
        paymentMethods={PAYMENT_METHODS}
      />
    </main>
  );
}
