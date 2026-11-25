export function PortfolioMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="6" fill="currentColor" />
      <path d="M5 16l6-7h2v6l-6 7H5zm10-3 6-7h2v7l-6 7h-2z" fill="white" />
    </svg>
  );
}
