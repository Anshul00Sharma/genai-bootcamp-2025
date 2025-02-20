"use client";

import { DashboardCard } from "./DashboardCard";
import { Target, Book, Users, Flame } from "lucide-react";

const stats = [
  {
    label: "Success Rate",
    value: "80%",
    icon: Target,
    color: "text-green-500",
  },
  {
    label: "Study Sessions",
    value: "4",
    icon: Book,
    color: "text-blue-500",
  },
  {
    label: "Active Groups",
    value: "3",
    icon: Users,
    color: "text-purple-500",
  },
  {
    label: "Study Streak",
    value: "4 days",
    icon: Flame,
    color: "text-orange-500",
  },
];

export function QuickStats() {
  return (
    <DashboardCard title="Quick Stats" className="flex-1">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-accent-light/5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-md bg-white ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-sm text-slate-600">{stat.label}</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
