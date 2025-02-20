"use client";

import { StudyActivityCard } from "@/components/study-activity/StudyActivityCard";

// Mock data - replace with actual API call
const studyActivities = [
  {
    id: "1",
    name: "Vocabulary Quiz",
    thumbnailUrl: "/images/vocab-quiz.jpg",
    description:
      "Test your vocabulary knowledge with interactive flashcards and multiple choice questions.",
  },
  {
    id: "2",
    name: "Grammar Practice",
    thumbnailUrl: "/images/grammar.jpg",
    description:
      "Practice your grammar skills with sentence construction and error identification exercises.",
  },
];

export default function StudyActivityPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">
          Study Activities
        </h1>
        <p className="text-slate-600">
          Choose an activity to practice and improve your language skills
        </p>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyActivities.map((activity) => (
          <StudyActivityCard
            key={activity.id}
            id={activity.id}
            name={activity.name}
            thumbnailUrl={activity.thumbnailUrl}
            description={activity.description}
          />
        ))}
      </div>
    </div>
  );
}
