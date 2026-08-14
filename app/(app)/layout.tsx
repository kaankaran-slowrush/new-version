import { TopNav } from "@/components/chrome/top-nav";

/* The product shell. /docs deliberately sits OUTSIDE this route group: it is a
   reference site with its own persistent index, not a product surface, and
   putting the app chrome around it would muddle which is which. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {/* Clears the fixed pill: 60px nav + 16px inset + breathing room. That is
          this div's whole job now.

          It used to carry `data-plane-scope`, which turned every product route's
          `<main>` into a bordered, rounded, lifted panel from one rule. The panel
          is gone — content sits directly in the space, and the space is dark enough
          to read against because the ground is. See `.spatial-ground`. */}
      <div className="pt-24">{children}</div>
    </>
  );
}
