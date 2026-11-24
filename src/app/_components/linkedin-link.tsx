export function LinkedInLink({ children }: { children: string }) {
  return (
    <a href="https://www.linkedin.com/in/ohamin/" className="flex min-h-11 w-fit items-center gap-[.2em] font-[650] text-ring hover:underline hover:underline-offset-[.2em]">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
