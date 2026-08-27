import { GoogleGenAI } from "@google/genai";
import type {
  AIProvider,
  GenerateQuestionsInput,
  GeneratedQuestion,
} from "./ai.types.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class GeminiProvider implements AIProvider {
  async generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]> {
    const prompt = `
You are an expert technical interviewer.

Generate exactly ${input.count} interview questions.

Interview type: ${input.type}
Difficulty: ${input.difficulty}

Return ONLY a JSON array.

Each object must contain:

{
  "question": string,
  "type": "MCQ" | "SUBJECTIVE" | "CODING",
  "options": string[] | null,
  "correctAnswer": string | null,
  "explanation": string | undefined
}

Rules:

1. MCQ:
   - type must be "MCQ"
   - exactly 4 options
   - correctAnswer must match one of the options

2. SUBJECTIVE:
   - type must be "SUBJECTIVE"
   - options must be null
   - correctAnswer must be null
   - explanation should describe what a good answer should contain

3. CODING:
   - type must be "CODING"
   - options must be null
   - correctAnswer must be null
   - explanation should describe the expected solution/concept

Do not include markdown.
Do not include code fences.
Return only valid JSON.
`;

    const response = await ai.models.generateContent({
      model:
        process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    const parsed = JSON.parse(text);

    return parsed as GeneratedQuestion[];
  }
}

export const geminiProvider =
  new GeminiProvider();