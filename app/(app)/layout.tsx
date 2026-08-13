import { TopNav } from "@/components/chrome/top-nav";

/* The product shell. /docs deliberately sits OUTSIDE this route group: it is a
   reference site with its own persistent index, not a product surface, and
   putting the app chrome around it would muddle which is which. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {/* Clears the fixed pill: 60px nav + 16px inset + breathing room.

          `data-plane-scope` is how the spatial theme turns all twelve product
          routes into floating planes from ONE rule in globals.css, instead of
          twelve edits to twelve `<main>` elements. The rule targets
          `[data-plane-scope] > main`; the attribute is inert under light and dim.
          Bare `main` would have been wrong — /docs' main is a flex child beside a
          persistent index and the 404's is a min-h-dvh centring grid. */}
      <div data-plane-scope className="pt-24">
        {children}
      </div>
    </>
  );
}
