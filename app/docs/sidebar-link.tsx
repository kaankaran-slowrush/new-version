"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Split out as a client component so the docs layout itself stays a server
    component — only the bit that needs to know the current route ships JS. */
export function DocsSidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-sm px-2.5 py-1.5 text-sm transition-colors duration-(--duration-fast)",
        active
          ? "bg-accent-soft font-medium text-accent-ink"
          : "text-ink-secondary hover:bg-surface-hover hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
