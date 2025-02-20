# German Vocabulary Generator - Technical Specification

## 1. Project Overview

A single-page web application that generates contextual German vocabulary lists based on user-provided topics. The app will return German words along with their phonetic pronunciations, English translations, and additional metadata about word usage and type.

## 2. Features and Requirements

### 2.1 Core Features

- Single-screen interface with a search input and results display
- Topic-based vocabulary generation (10 words per topic)
- Each vocabulary item includes:
  - German word/phrase
  - Phonetic pronunciation
  - English translation
  - Part of speech/type
  - Usage context (formal/informal/both)

### 2.2 User Interface

- Clean, minimalist design
- Search input field for topic entry
- Organized display of vocabulary results
- Loading state indication during API calls

## 3. Technical Architecture

### 3.1 Frontend (Next.js)

- Single page component (`app/page.tsx`)
- React state management for search and results
- Tailwind CSS for styling
- TypeScript for type safety

### 3.2 Backend (API Route)

- Next.js API route for vocabulary generation
- Integration with language translation/generation service
- Error handling and rate limiting

### 3.3 Data Model

```typescript
interface VocabularyItem {
  german: string;
  phonetic: string;
  english: string;
  parts: {
    type: string; // e.g., 'greeting', 'noun', 'verb'
    usage: "formal" | "informal" | "both";
  };
}

interface ApiResponse {
  topic: string;
  words: VocabularyItem[];
}
```

## 4. Implementation Details

### 4.1 Frontend Implementation

- Search input with debounced API calls
- Results display component with proper loading states
- Error handling and user feedback
- Responsive design for all screen sizes

### 4.2 API Implementation

- POST endpoint at `/api/generate-vocab`
- Request validation
- Integration with AI service for vocabulary generation
- Response formatting and error handling

### 4.3 Error Handling

- Invalid topic inputs
- API failures
- Rate limiting
- Network errors

## 5. Dependencies

- Next.js 14+
- React 18+
- Tailwind CSS
- TypeScript
- AI service for vocabulary generation (TBD)

## 6. Development Guidelines

- Use TypeScript for all components and functions
- Follow React best practices and hooks
- Implement proper error boundaries
- Add loading states for better UX
- Include proper TypeScript types and interfaces
