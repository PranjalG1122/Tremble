import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("lg:text-base text-sm", {
  variants: {
    variant: {
      default: "text-text-50",
      gray: "text-text-200",
    },
    size: {
      lg: "lg:text-lg text-base",
      base: "lg:text-base text-sm",
      sm: "lg:text-sm text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <p
        className={twMerge(variants({ variant, size, className }))}
        {...props}
        ref={ref}
      />
    );
  }
);
