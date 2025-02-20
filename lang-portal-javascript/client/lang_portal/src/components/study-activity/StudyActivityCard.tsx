"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Info } from "lucide-react";

interface StudyActivityCardProps {
  id: string;
  name: string;
  thumbnailUrl: string;
  description: string;
}

export function StudyActivityCard({ id, name, thumbnailUrl, description }: StudyActivityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-accent/10 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/study-activity/${id}/launch`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
          >
            <Play className="h-4 w-4" />
            Launch
          </Link>
          
          <Link
            href={`/dashboard/study-activity/${id}`}
            className="inline-flex items-center justify-center w-10 h-10 border border-accent/20 hover:bg-accent/5 rounded-lg transition-colors"
          >
            <Info className="h-4 w-4 text-slate-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
