import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
