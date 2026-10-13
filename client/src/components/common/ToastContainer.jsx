import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useApp } from "../../hooks/useApp";

/**
 * ToastContainer renders floating feedback notifications across the app.
 * Connected directly to AppContext state.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = "bg-slate-900 text-white border-slate-800";
        let Icon = Info;
        let iconColor = "text-sky-400";

        if (toast.type === "success") {
          bgClass = "bg-emerald-900/95 text-emerald-50 border-emerald-700/60";
          Icon = CheckCircle2;
          iconColor = "text-emerald-400";
        } else if (toast.type === "error") {
          bgClass = "bg-rose-900/95 text-rose-50 border-rose-700/60";
          Icon = AlertCircle;
          iconColor = "text-rose-400";
        } else if (toast.type === "warning") {
          bgClass = "bg-amber-900/95 text-amber-50 border-amber-700/60";
          Icon = AlertTriangle;
          iconColor = "text-amber-400";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${bgClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
