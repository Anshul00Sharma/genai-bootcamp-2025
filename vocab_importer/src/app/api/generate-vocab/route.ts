import { NextResponse } from 'next/server';
import type { ApiRequest, ApiResponse } from '@/types/vocabulary';
import { generateVocabulary } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const body: ApiRequest = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const words = await generateVocabulary(topic);
    
    const response: ApiResponse = {
      topic,
      words
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    return NextResponse.json(
      { error: 'Failed to generate vocabulary' },
      { status: 500 }
    );
  }
}
