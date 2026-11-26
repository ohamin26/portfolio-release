"use client";

import type { ComponentProps, MouseEvent } from "react";
import { emphasizeWorkTitle } from "./work-arrival";

let stopWatching: (() => void) | undefined;

function visitWork(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const work = document.getElementById("work");
  if (!work) return;
  event.preventDefault();
  stopWatching?.();
  if (location.hash !== "#work") history.pushState(null, "", "#work");
  work.focus({ preventScroll: true });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) {
    work.scrollIntoView({ block: "start", behavior: "instant" });
    return;
  }

  const margin = parseFloat(getComputedStyle(work).scrollMarginTop) || 0;
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const destination = Math.max(0, Math.min(max, window.scrollY + work.getBoundingClientRect().top - margin));
  const controller = new AbortController();
  const options = { signal: controller.signal, passive: true };
  const stop = () => {
    controller.abort();
    clearTimeout(expiry);
    stopWatching = undefined;
  };
  const arrive = () => {
    if (location.hash !== "#work" || !work.isConnected || document.activeElement !== work) return stop();
    if (Math.abs(window.scrollY - destination) > 1) return;
    stop();
    emphasizeWorkTitle(work.querySelector<HTMLElement>("h3 button [data-work-title]"));
  };
  // 종료 시각으로 강조하지 않는다. 레이아웃이 이동 중 바뀌어 도착하지 못한 경우의 정리용이다.
  const expiry = window.setTimeout(stop, 2500);
  stopWatching = stop;
  document.addEventListener("onscrollend" in document ? "scrollend" : "scroll", arrive, options);
  window.addEventListener("keydown", stop, options);
  window.addEventListener("wheel", stop, options);
  window.addEventListener("touchstart", stop, options);
  reduced.addEventListener("change", () => {
    stop();
    if (reduced.matches && work.isConnected && document.activeElement === work)
      work.scrollIntoView({ block: "start", behavior: "instant" });
  }, options);
  // 포커스로 메뉴가 스크롤된 프레임을 먼저 그린다. 같은 프레임에서 다시 스크롤하면
  // Chromium이 새 요청을 앞선 스크롤의 종료로 처리할 수 있다.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (controller.signal.aborted) return;
    window.scrollTo({ top: destination, behavior: "smooth" });
    arrive(); // 이미 해당 위치에 있으면 scrollend도 발생하지 않는다.
  }));
}

export function WorkLink({ onClick, ...props }: Omit<ComponentProps<"a">, "href">) {
  return <a {...props} href="#work" onClick={(event) => { onClick?.(event); visitWork(event); }} />;
}
