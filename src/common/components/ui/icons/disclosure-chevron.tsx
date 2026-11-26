export function DisclosureChevron({ expanded }: { expanded: boolean }) {
  return (
    <span aria-hidden="true" className={`size-2.5 justify-self-center border-r-2 border-b-2 text-ring ${expanded ? "-rotate-[135deg]" : "rotate-45"}`} />
  );
}
