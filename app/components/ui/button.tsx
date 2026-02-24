"use client";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
  size?: "default" | "lg";
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center font-bold transition rounded-xl";
  const variants =
    variant === "outline"
      ? "border border-white/20 text-white hover:bg-white/5"
      : "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90";
  const sizes = size === "lg" ? "px-10 py-7 text-lg" : "px-4 py-2";

  return <button className={`${base} ${variants} ${sizes} ${className}`} {...props} />;
}