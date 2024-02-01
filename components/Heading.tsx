import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("", {
  variants: {
    variant: {
      default: "",
      large: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof variants> {}

export const Text = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, ...props }) => {
    return (
      <h1 className={twMerge(variants({ variant }), className)} {...props} />
    );
  }
);
