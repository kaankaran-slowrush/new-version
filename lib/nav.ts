/* =============================================================================
   Navigation IA
   =============================================================================
   Three flat top-level items only; everything else lives behind one dropdown.

   Why: "Agents", "Workflows" and "Models" are the product's three core content
   types — the nouns a user comes here to work with. Everything under Platform
   is infrastructure you visit occasionally (keys, logs, delivery endpoints).
   Mixing the two classes of thing in one flat row makes the important three
   compete with plumbing.

   Home is deliberately NOT a nav item: the wordmark returns to the dashboard,
   which is the near-universal convention and buys back a slot.
   ============================================================================= */

export interface NavLink {
  label: string;
  href: string;
  /** One line shown in the mega-menu; omit for flat links. */
  description?: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Agents", href: "/agents" },
  { label: "Workflows", href: "/workflows" },
  { label: "Models", href: "/models" },
];

export const PLATFORM_NAV: NavLink[] = [
  { label: "Playground", href: "/playground", description: "Try a single model without starting a session" },
  { label: "Run History", href: "/platform/run-history", description: "Inspect past agent and model runs" },
  /* BILLING SITS WITH THE OPERATIONAL SURFACES, not with account settings, and it
     moved rather than being copied. Spend is the thing an operator checks in the
     same breath as run history — "what ran, and what did it cost" is one question
     — and the topbar's balance chip already points here, which made the account
     dropdown a second route to a destination the chrome was already exposing.

     It is NOT also left in the workspace dropdown. One destination in two menus
     means neither is authoritative, and the reader has to learn both. */
  { label: "Billing", href: "/settings/billing", description: "Balance, spend, payment methods, and invoices" },
  { label: "API Keys", href: "/platform/api-keys", description: "Manage keys for programmatic access" },
  { label: "Webhooks", href: "/platform/webhooks", description: "Configure event delivery endpoints" },
  { label: "Docs", href: "/docs", description: "Design system, components, and UX guidance" },
];

export const WORKSPACE_NAV: NavLink[] = [
  { label: "Workspace", href: "/settings/workspace" },
];

export const ACCOUNT_NAV: NavLink[] = [
  { label: "Account", href: "/settings/account" },
  { label: "Support", href: "#" },
  { label: "Log out", href: "/login" },
];
