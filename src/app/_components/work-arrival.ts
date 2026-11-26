// 같은 제목에 연속 도착해도 앞 효과의 정리가 새 효과를 지우지 않게 한다.
let cue = 0;

export function emphasizeWorkTitle(title: HTMLElement | null) {
  if (!title || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (title.hasAttribute("data-work-arrival")) {
    title.removeAttribute("data-work-arrival");
    void title.offsetWidth; // 아직 재생 중인 제목을 다시 선택했을 때만 CSS 효과를 재시작한다.
  }
  const id = String(++cue);
  title.dataset.workArrival = id;
  const clear = () => {
    if (title.dataset.workArrival === id) delete title.dataset.workArrival;
  };
  const animation = title.getAnimations().find((item) =>
    item instanceof CSSAnimation && item.animationName === "work-title-arrive");
  if (animation) void animation.finished.then(clear, clear);
  else clear();
}
