export function SystemStudyIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 340 166" fill="none" aria-hidden="true" focusable="false">
      <g stroke="#b5c2db" strokeWidth=".7" strokeDasharray="3 4">
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}>
            <path d={`M ${24 + i * 25} ${78 - i * 12} l 168 78`} />
            <path d={`M ${26 + i * 26} ${125 + i * 4} l 159 -88`} />
          </g>
        ))}
      </g>
      <g strokeLinejoin="round">
        <path d="m60 94 118-67 105 50-117 70z" fill="#e4e9f0" stroke="#9eaec5" />
        <path d="m60 85 118-67 105 50-117 70z" fill="#edf0f5" stroke="#9eaec5" />
        <path d="m60 75 118-67 105 47-117 71z" fill="white" stroke="#435d8a" />
      </g>
      <path d="m70 75 108-61 22 10-108 62z" fill="#2454c6" />
      <path d="m100 88 26-15 18 8-26 15z" fill="#cad9ff" />
      <g stroke="#c3cad5" strokeWidth="4">
        <path d="m135 71 46-26m-37 30 34-19m-45 47 76-43m-66 46 75-42" />
      </g>
      <g fill="#2454c6">
        <circle cx="178" cy="8" r="3.2" />
        <circle cx="166" cy="126" r="3.2" />
      </g>
    </svg>
  );
}
