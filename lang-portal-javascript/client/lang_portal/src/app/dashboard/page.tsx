"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { LastStudySession } from "@/components/dashboard/LastStudySession";
import { StudyProgress } from "@/components/dashboard/StudyProgress";
import { QuickStats } from "@/components/dashboard/QuickStats";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-accent/70">
            Track your language learning progress
          </p>
        </div>

        <Link
          href="/dashboard/study-activity"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
        >
          <Play className="h-4 w-4" />
          Start Studying
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LastStudySession />
        <StudyProgress />
        <QuickStats />
      </div>
    </div>
  );
}
