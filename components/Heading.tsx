import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("", {
  variants: {
    variant: {
      default: "lg:text-lg text-base font-medium",
      l: "lg:text-2xl text-xl font-semibold",
      xl: "lg:text-4xl text-2xl font-bold",
      xxl: "lg:text-6xl text-3xl font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof variants> {}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={twMerge(variants({ variant }), className)}
        {...props}
      />
    );
  }
);
