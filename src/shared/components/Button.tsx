"use client";

import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";

type Variant = "primary" | "secondary" | "danger" | "danger-soft" | "ghost";

interface ButtonProps extends Omit<HeroButtonProps, "variant"> {
  variant?: Variant;
}

/** Envoltorio de HeroUI: el resto de la app solo depende de este componente. */
export function Button({ variant = "primary", size = "sm", ...props }: ButtonProps) {
  return <HeroButton variant={variant === "secondary" ? "outline" : variant} size={size} {...props} />;
}
