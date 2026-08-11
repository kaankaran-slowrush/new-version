# Drop existing pages here

Anything useful for the migration phase — code, screenshots, notes. No structure
required; one folder or file per page is enough. Screenshots alone are fine.

Nothing in this folder is imported by the app. It exists purely as reference
material for porting existing screens onto the kit's components, and can be
deleted once the migration is done.

## Priority

**Tier 1 — genuinely need to see these**
- `workflows/` — the biggest unknown. Node canvas? Linear chain list? Templates?
- `playground/` — layout and parameter controls vary enormously between products.
- `models/` — which fields per model, what filtering, how pricing is shown.

**Tier 2 — helps a lot, but I can make reasonable guesses**
- `run-history/` — the exact columns and filters you use.
- `billing/` — depends on your pricing model (credits vs. seats vs. metered).
- `webhooks/` — event catalogue and delivery-log shape.

**Tier 3 — I can build these blind from convention; send only if yours differ**
- `api-keys/`, `workspace-settings/`, `account/`, `login/`, `signup/`

## Also useful

- `package.json` from the production repo — confirms the porting path (Tailwind
  version, whether shadcn/Radix is already present).
- Any existing theme/token file, so I can map old names to the new semantic layer.
