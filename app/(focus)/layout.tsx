/* Focus-mode shell: no topbar, no page padding.
   The session workspace renders its own header and owns the full viewport — see
   SessionWorkspace's UX notes for why the app chrome is deliberately absent, and
   how the two exits (rail "← Sessions", header wordmark) replace it. */
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
