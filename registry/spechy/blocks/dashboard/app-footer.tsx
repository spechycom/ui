export function AppFooter() {
  return (
    <footer className="flex h-8 shrink-0 items-center border-t bg-card px-4">
      <p className="text-xs text-text-faint">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </footer>
  )
}
