import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-sm focus:ring-slate-700",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-indigo-500 shadow-xs",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500",
    emerald: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base font-semibold",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
