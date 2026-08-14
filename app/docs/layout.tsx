import Link from "next/link";
import { DOCS_NAV } from "@/lib/docs-nav";
import { DocsSidebarLink } from "./sidebar-link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[84rem] gap-10 px-6 lg:px-10">
      {/* Docs gets a persistent index because it is a reference you jump around
          in. The product deliberately has no sidebar — different job. */}
      <aside
        /* GLASS, because this index is chrome rather than content — a persistent
           thing you jump around in, which is exactly what glass is licensed for.
           It reads as floating over the space, the same as the nav and the session
           rails, instead of being part of the page it indexes.

           It is also the one region that NEEDS its own material. The docs container
           is wider than the product column, so this sidebar sits where the ground is
           feathering out toward the photograph; `ink-tertiary` group labels would
           land near 3.7:1 there. Everything else on the page is inside the ground's
           full-strength zone. */
        className="glass sticky top-4 z-(--z-sticky) hidden h-[calc(100dvh-2rem)] w-56 shrink-0 overflow-y-auto rounded-2xl px-5 py-8 lg:block"
      >
        <Link href="/" className="mb-8 inline-flex items-baseline font-mono text-base">
          model<span className="font-semibold text-accent-ink">.store</span>
        </Link>
        <p className="mb-8 eyebrow text-ink-secondary">
          UI Kit
        </p>

        <nav className="space-y-7 pb-16">
          {DOCS_NAV.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2.5 eyebrow text-ink-tertiary">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <DocsSidebarLink href={item.href}>{item.label}</DocsSidebarLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 py-10 lg:py-16">
        <div className="max-w-[52rem]">{children}</div>
      </main>
    </div>
  );
}
