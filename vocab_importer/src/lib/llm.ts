import { Groq } from 'groq-sdk';
import type { VocabularyItem } from '@/types/vocabulary';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are a German language expert. Your task is to generate vocabulary lists based on given topics.
For each word, provide:
- The German word/phrase
- Its phonetic pronunciation (simplified for English speakers)
- English translation
- Word type (noun, verb, adjective, etc.)
- Usage context (formal, informal, or both)

Format each word exactly according to the specified structure.
IMPORTANT: Always respond with valid JSON data only.`;

const USER_PROMPT_TEMPLATE = (topic: string) => `
Generate 10 German vocabulary words related to the topic: "${topic}".
Each word should be relevant to the topic and commonly used in German.
Include a mix of different word types (nouns, verbs, adjectives) where appropriate.
Respond ONLY with valid JSON data in this exact structure:
{
  "words": [
    {
      "german": "Example",
      "phonetic": "ex-AM-ple",
      "english": "example",
      "parts": {
        "type": "noun",
        "usage": "both"
      }
    }
  ]
}`;

function extractJsonFromResponse(response: string): string {
  try {
    // Find the first occurrence of '{'
    const startIndex = response.indexOf('{');
    // Find the last occurrence of '}'
    const endIndex = response.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON object found in response');
    }
    
    // Extract the JSON part
    const jsonPart = response.substring(startIndex, endIndex + 1);
    return jsonPart;
  } catch (error) {
    console.error('Error extracting JSON:', error);
    throw new Error('Failed to extract JSON from response');
  }
}

export async function generateVocabulary(topic: string): Promise<VocabularyItem[]> {
  try {
    const completion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT_TEMPLATE(topic) }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const response = completion.choices[0]?.message?.content;
    console.log('Raw response:', response);
    
    if (!response) {
      throw new Error('No response from LLM');
    }

    try {
      // Extract JSON part from the response
      const jsonString = extractJsonFromResponse(response);
      console.log('Extracted JSON:', jsonString);
      
      const parsedResponse = JSON.parse(jsonString);
      if (!parsedResponse.words || !Array.isArray(parsedResponse.words)) {
        throw new Error('Invalid response format');
      }
      return parsedResponse.words;
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      throw new Error('Failed to parse vocabulary data');
    }
  } catch (error) {
    console.error('Error generating vocabulary:', error);
    throw new Error('Failed to generate vocabulary');
  }
}
