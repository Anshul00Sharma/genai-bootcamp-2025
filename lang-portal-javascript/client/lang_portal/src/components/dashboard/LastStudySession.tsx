"use client";

import { DashboardCard } from "./DashboardCard";
import { Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LastStudySession() {
  return (
    <DashboardCard title="Last Study Session" className="flex-1">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">2 hours ago</span>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-800 mb-1">Basic Greetings</h3>
          <p className="text-sm text-slate-600">Vocabulary Practice</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-slate-700">8 correct</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-slate-700">2 wrong</span>
          </div>
        </div>

        <Link 
          href="/dashboard/word-group/1" 
          className="inline-flex items-center text-sm text-accent hover:text-accent-dark transition-colors"
        >
          View Group
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </DashboardCard>
  );
}
