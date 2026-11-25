export function PlanOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2">
        <path d="M18 16h364v168H18z" />
        <path d="M196 16v71m0 28v69M18 132h73m30 0h75m0-70h83m28 0h75" />
      </g>
      <g stroke="currentColor" strokeDasharray="3 5">
        <path d="M38 100h136m50 0h137M100 32v78m197-28v85" />
      </g>
    </svg>
  );
}
