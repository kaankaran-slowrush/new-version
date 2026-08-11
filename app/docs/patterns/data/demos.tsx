"use client";

/* =============================================================================
   Client specimens for /docs/patterns/data
   =============================================================================
   The docs pages are server components, so they cannot pass function props.
   CodeBlock, CopyField and FilterPills are all presentational — they take a
   callback and a boolean rather than owning state — which is exactly the split
   that makes them server-safe in the product. Demonstrating that split honestly
   means the *caller* has to be a client component, so it lives here.
   ============================================================================= */

import * as React from "react";
import { CodeBlock, CopyField, FilterPills } from "@/components/patterns";

const SNIPPET = `curl https://api.model.store/v1/agents/ag_8f21/runs \\
  -H "Authorization: Bearer $MODELSTORE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input":{"prompt":"a porcelain teapot, studio light"},"stream":true}'`;

/** Shows the onCopy / copied contract with a real clipboard write. */
export function CodeBlockDemo() {
  const [copied, setCopied] = React.useState(false);

  return (
    <CodeBlock
      filename="examples/create-run.sh"
      language="bash"
      code={SNIPPET}
      copied={copied}
      onCopy={() => {
        void navigator.clipboard?.writeText(SNIPPET);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    />
  );
}

export function CopyFieldDemo() {
  const [copied, setCopied] = React.useState(false);
  /* THE PREFIX IS THE PRODUCT'S OWN, and it has to stay that way. This was
     `sk_live_…` — Stripe's live-key shape — which was wrong twice over: model.store
     issues its own keys, so a payment processor's format in its documentation is
     simply inaccurate; and GitHub's secret scanner matches that pattern, so the
     fixture blocked every push to the repository until it was changed. A demo
     credential must look like the product's credential and like nothing else's. */
  const value = "ms_live_9Qb2xR7mVt4Ld1PzKn8Ay6Ew";

  return (
    <CopyField
      label="Live secret key"
      value={value}
      hint="Created 12 Jun · full access · shown once"
      copied={copied}
      onCopy={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    />
  );
}

export function FilterPillsDemo({
  variant = "solid",
}: {
  variant?: "solid" | "segmented";
}) {
  const [value, setValue] = React.useState("all");

  return (
    <FilterPills
      variant={variant}
      aria-label="Filter runs by status"
      value={value}
      onValueChange={setValue}
      items={[
        { value: "all", label: "All", count: 248 },
        { value: "running", label: "Running", count: 6 },
        { value: "succeeded", label: "Succeeded", count: 231 },
        { value: "failed", label: "Failed", count: 11 },
        { value: "archived", label: "Archived", disabled: true },
      ]}
    />
  );
}
