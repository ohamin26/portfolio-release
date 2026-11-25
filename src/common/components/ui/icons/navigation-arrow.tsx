const arrows = {
  left: "←",
  right: "→",
  "up-right": "↗",
} as const;

export function NavigationArrow({ direction }: { direction: keyof typeof arrows }) {
  return <span aria-hidden="true">{arrows[direction]}</span>;
}
