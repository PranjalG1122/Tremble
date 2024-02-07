import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("rounded-sm font-regular lg:text-base text-sm", {
  variants: {
    variant: {
      primary:
        "px-6 py-2 bg-white text-text-800 hover:bg-background-100 transition-all",
      secondary:
        "px-6 py-2 bg-background-600 hover:bg-background-500 transition-all",
      link: "",
      input: "px-3 py-2 bg-background-600 text-text-50 focus:outline-none",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(variants({ variant }), className)}
        {...props}
      />
    );
  }
);
