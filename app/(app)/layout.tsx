import { TopNav } from "@/components/chrome/top-nav";

/* The product shell. /docs deliberately sits OUTSIDE this route group: it is a
   reference site with its own persistent index, not a product surface, and
   putting the app chrome around it would muddle which is which. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {/* Clears the fixed pill: 60px nav + 16px inset + breathing room. */}
      <div className="pt-24">{children}</div>
    </>
  );
}
