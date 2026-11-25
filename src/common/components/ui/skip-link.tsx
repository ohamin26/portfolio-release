export function SkipLink() {
  return (
    <a
      href="#main-content"
      tabIndex={0}
      className="fixed top-2 left-4 z-50 -translate-y-[180%] bg-background px-[18px] py-3 text-foreground focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      본문 바로가기
    </a>
  );
}
