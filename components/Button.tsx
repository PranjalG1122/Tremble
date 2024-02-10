import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const variants = cva("rounded-sm font-regular lg:text-base text-sm", {
  variants: {
    variant: {
      primary:
        "px-6 py-2 bg-white text-text-800 hover:bg-background-100 transition-all disabled:opacity-70 disabled:hover:none",
      secondary:
        "px-6 py-2 bg-background-600 hover:bg-background-500 transition-all",
      link: "text-blue-400 hover:text-blue-300 font-medium transition-all focus:outline-none ",
      input: "px-3 py-2 bg-background-600 text-text-50 focus:outline-none",
      icon: "h-6 w-6",
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
        className={twMerge(variants({ variant, className }))}
        {...props}
      />
    );
  }
);
