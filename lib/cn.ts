import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, with later Tailwind utilities winning over earlier ones.
 *
 * Without this, `cn("p-2", "p-4")` would emit both and let CSS source order
 * decide — which means a component's default padding could silently beat the
 * override a caller passed in. Every component in this kit takes a `className`
 * prop and runs it through here last, so callers can always override.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
