"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Group,
  Clock,
  Settings,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Study Activity",
    icon: BookOpen,
    href: "/dashboard/study-activity",
  },
  {
    title: "Words",
    icon: FileText,
    href: "/dashboard/words",
  },
  {
    title: "Word Group",
    icon: Group,
    href: "/dashboard/word-group",
  },
  {
    title: "Study Session",
    icon: Clock,
    href: "/dashboard/study-session",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-primary h-full flex flex-col">
      {/* Logo Area */}
      <div className="p-6 border-b border-secondary">
        <h1 className="text-xl font-semibold text-accent-light">Lang Portal</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-secondary text-accent-light shadow-lg shadow-secondary/30 border border-secondary-hover"
                    : "text-accent-light/70 hover:bg-secondary/50 hover:text-accent-light"
                }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
