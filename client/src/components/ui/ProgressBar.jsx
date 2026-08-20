import React from "react";

export function ProgressBar({ value, max = 100, showLabel = true, className = "" }) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  let barColor = "bg-emerald-500";
  if (percentage > 85) barColor = "bg-rose-500";
  else if (percentage > 65) barColor = "bg-amber-500";

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>Capacity Filled</span>
          <span className="font-bold">{value} / {max} ({percentage}%)</span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
