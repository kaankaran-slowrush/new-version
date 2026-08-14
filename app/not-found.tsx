import Link from "next/link";
import { buttonVariants } from "@/components/primitives";
import { SectionHeader } from "@/components/patterns";

/* UX NOTES
   • A 404 SHOULD OFFER ROUTES, NOT APOLOGIES. "Oops, something went wrong" tells
     the user nothing they did not already know; a short list of the places they
     were probably trying to reach actually recovers the session.
   • Lives at the app root (outside every route group) so it renders for any
     unmatched path, with the ambient background from the root layout intact. */
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      {/* `data-plane`, and on THIS element rather than on the `main` above it:
          that main is a min-h-dvh centring grid, so a plane there would be a
          full-viewport panel with the content floating in the middle of it. This
          block is also the only thing standing between near-white text and a
          photograph, so it is not decorative here. */}
      <div data-plane="padded" className="w-full max-w-md text-center">
        <SectionHeader
          level={1}
          align="center"
          eyebrow="404"
          title="This page doesn't exist."
          description="The link may be out of date, or the session may have been deleted."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Go to dashboard
          </Link>
          <Link
            href="/agents"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Open Agents
          </Link>
        </div>

        <div className="rounded-2xl bg-surface-sunken p-4 text-left">
          <p className="mb-2 eyebrow text-ink-secondary">
            Or jump to
          </p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {[
              { href: "/models", label: "Models" },
              { href: "/workflows", label: "Workflows" },
              { href: "/platform/run-history", label: "Run history" },
              { href: "/docs", label: "Design system docs" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-sm px-2 py-1.5 text-sm text-ink-secondary transition-colors duration-(--duration-fast) hover:bg-surface-hover hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
