import React from "react";

export function Input({
  label,
  error,
  icon: Icon,
  className = "",
  type = "text",
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          className={`w-full text-sm rounded-lg border border-slate-300 bg-white py-2 ${
            Icon ? "pl-9" : "pl-3"
          } pr-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
