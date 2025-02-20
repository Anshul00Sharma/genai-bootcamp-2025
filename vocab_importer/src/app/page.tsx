"use client";

import { useState } from "react";
import type { VocabularyItem } from "@/types/vocabulary";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [copied, setCopied] = useState(false);

  const handleSearch = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-vocab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate vocabulary");
      }

      const data = await response.json();
      setWords(data.words);
    } catch {
      setError("Failed to generate vocabulary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const jsonData = {
      topic,
      words,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          German Vocabulary Generator
        </h1>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., greetings, food, weather)"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        {/* Results Section */}
        {words.length > 0 && (
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm border transition-colors"
              title="Copy JSON"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            <pre className="bg-gray-50 p-6 rounded-lg overflow-auto">
              <code className="text-sm">
                {JSON.stringify({ topic, words }, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {/* Empty State */}
        {!loading && words.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            Enter a topic to generate German vocabulary
          </div>
        )}
      </div>
    </div>
  );
}

// Copy icon component
function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

// Check icon component
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
