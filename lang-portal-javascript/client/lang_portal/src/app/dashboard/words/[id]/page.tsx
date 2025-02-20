"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WordDetails {
  german: string;
  phonetic: string;
  english: string;
}

export default function WordPage() {
  const params = useParams();
  const [word, setWord] = useState<WordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/words/${params.id}`
        );
        
        if (!response.ok) {
          throw new Error(`Word not found`);
        }
        
        const data = await response.json();
        setWord(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch word");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWord();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!word) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {word.german}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Phonetics
              </h3>
              <p className="text-lg mt-1">{word.phonetic}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                English
              </h3>
              <p className="text-lg mt-1">{word.english}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
