import type { ComponentProps } from "react";
import { cn } from "@/common/lib/utils";

const variants = {
  default: "bg-neutral-900 text-white hover:bg-neutral-700",
  outline: "border border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-100",
  link: "text-blue-700 underline-offset-4 hover:underline",
};

type ButtonStyle = { variant?: keyof typeof variants; className?: string };

export function buttonVariants({ variant = "default", className }: ButtonStyle = {}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
    "motion-safe:transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  variant, className, type = "button", ...props
}: ComponentProps<"button"> & ButtonStyle) {
  return <button {...props} type={type} className={buttonVariants({ variant, className })} />;
}
