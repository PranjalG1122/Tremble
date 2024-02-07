import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("lg:text-base text-sm", {
  variants: {
    variant: {
      default: "text-text-50",
      gray: "text-text-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <p
        className={twMerge(variants({ variant }), className)}
        {...props}
        ref={ref}
      />
    );
  }
);
