import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/common/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background text-foreground hover:bg-accent",
        link: "text-selection underline-offset-4 hover:underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Button({ asChild = false, className, variant, type, ...props }: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "default"}
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
