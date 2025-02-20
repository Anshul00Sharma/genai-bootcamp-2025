# German Vocabulary Generator

A Next.js application that generates German vocabulary words based on user-provided topics. The app uses Groq's LLM to provide accurate translations, phonetic pronunciations, and usage context.

## Features

- Generate 10 German vocabulary words for any topic
- Get phonetic pronunciations for each word
- Learn word types and usage contexts (formal/informal)
- Copy results in JSON format

## Prerequisites

- Node.js 18+ installed
- A Groq API key ([Get one here](https://console.groq.com))

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd vocab_importer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

## Running the App

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a topic in the search field (e.g., "food", "travel", "business")
2. Click "Generate" or press Enter
3. View the generated vocabulary list
4. Use the copy button to copy the results in JSON format

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Groq API (deepseek-r1-distill-llama-70b model)