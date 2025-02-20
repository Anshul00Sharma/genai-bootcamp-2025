"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-accent/10 p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-primary mb-4">{title}</h2>
      {children}
    </div>
  );
}
