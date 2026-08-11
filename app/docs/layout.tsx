import Link from "next/link";
import { DOCS_NAV } from "@/lib/docs-nav";
import { DocsSidebarLink } from "./sidebar-link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[84rem] gap-10 px-6 lg:px-10">
      {/* Docs gets a persistent index because it is a reference you jump around
          in. The product deliberately has no sidebar — different job. */}
      <aside className="sticky top-0 z-(--z-sticky) hidden h-dvh w-56 shrink-0 overflow-y-auto py-10 lg:block">
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
