import { PlanOutline } from "@/common/components/ui/icons/plan-outline";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { cn } from "@/common/lib/utils";
import { drawingElements, type DrawingElement } from "../_content/scada-example";

const positions = {
  a: "left-1/4 top-[37%]",
  b: "left-3/4 top-[69%]",
} as const;

type Props = { selected: DrawingElement; onSelect: (element: DrawingElement) => void };

export function ScadaDiagram({ selected, onSelect }: Props) {
  return (
    <RadioGroup
      aria-label="설비 도면"
      aria-describedby="drawing-hint"
      value={selected.id}
      onValueChange={(id) => {
        const element = drawingElements.find((item) => item.id === id);
        if (element) onSelect(element);
      }}
      className="relative block aspect-[2/1] w-full rounded-sm border border-border bg-muted"
    >
      <PlanOutline className="pointer-events-none absolute inset-0 size-full text-input" />
      {drawingElements.map((element) => (
        <label
          key={element.id}
          htmlFor={`drawing-${element.id}`}
          className={cn(
            "absolute inline-flex min-h-11 -translate-1/2 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-sm border border-input bg-background px-2 text-sm font-semibold has-aria-checked:border-ring has-aria-checked:bg-highlight has-aria-checked:text-selection has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ring",
            positions[element.id],
          )}
        >
          <RadioGroupItem
            id={`drawing-${element.id}`}
            value={element.id}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            onFocus={(event) => {
              // 짧은 방향키 입력도 도면의 포커스와 조회 대상을 일치시킨다.
              if (event.currentTarget.matches(":focus-visible")) onSelect(element);
            }}
          />
          <span aria-hidden="true" className={cn("size-2.5 border border-current", selected.id === element.id && "bg-current")} />
          {element.label}
        </label>
      ))}
    </RadioGroup>
  );
}
