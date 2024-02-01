import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("", {
  variants: {
    variant: {
      base: "",
      light: "",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

interface TextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, ...props }) => {
    return (
      <p className={twMerge(variants({ variant }), className)} {...props} />
    );
  }
);
