"use client";

import { DashboardCard } from "./DashboardCard";

export function StudyProgress() {
  return (
    <DashboardCard title="Study Progress" className="flex-1">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Total Words Studied</span>
            <span className="font-medium text-slate-800">3/124</span>
          </div>
          <div className="h-2 bg-accent/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent" 
              style={{ width: '2.4%' }} // (3/124) * 100
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Mastery Progress</span>
            <span className="font-medium text-slate-800">0%</span>
          </div>
          <div className="h-2 bg-accent/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent" 
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
