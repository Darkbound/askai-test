import { twMerge } from "tailwind-merge";
import { HTMLButtonProps } from "types";

type ButtonVariants = "primary" | "danger";

export interface ButtonProps extends HTMLButtonProps {
  variant?: ButtonVariants;
}

const buttonVariants: Record<ButtonVariants, string> = {
  primary: `bg-gradient-to-bl from-[#58a0ff] to-[#2784ff] text-white`,
  danger: "text-white bg-red-500"
};

export const Button = ({ variant = "primary", className, children, ...props }: ButtonProps) => {
  const classes = twMerge(
    `h-fit px-8 font-bold text-sm rounded-[70px] leading-[48px] min-w-[150px] ${buttonVariants[variant]} ${className}`
  );

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};
