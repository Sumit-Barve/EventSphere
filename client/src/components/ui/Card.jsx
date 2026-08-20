import React from "react";

export function Card({ children, className = "", hoverable = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${
        hoverable ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`p-5 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`p-5 bg-slate-50/50 border-t border-slate-100 ${className}`}>{children}</div>;
}
