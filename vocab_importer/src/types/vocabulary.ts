export interface VocabularyItem {
  german: string;
  phonetic: string;
  english: string;
  parts: {
    type: string; // e.g., 'greeting', 'noun', 'verb'
    usage: "formal" | "informal" | "both";
  };
}

export interface ApiResponse {
  topic: string;
  words: VocabularyItem[];
}

export interface ApiRequest {
  topic: string;
}
