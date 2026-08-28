import { GoogleGenAI } from "@google/genai";
import type {
  AIProvider,
  GenerateQuestionsInput,
  GeneratedQuestion,
} from "./ai.types.js";
import {
  generatedQuestionsSchema,
} from "./ai.schema.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class GeminiProvider implements AIProvider {
  async generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]> {
    const prompt = `
You are an expert interview question generator.

Generate exactly ${input.count} interview questions.

Interview category:
${input.type}

Question format:
${input.questionType}

Difficulty:
${input.difficulty}

IMPORTANT QUESTION FORMAT RULES:

1. If Question format is "MCQ":
   - Generate ONLY MCQ questions.
   - Every question must have type "MCQ".
   - Each MCQ must have exactly 4 options.
   - correctAnswer must exactly match one of the 4 options.
   - options must not be null.
   - correctAnswer must not be null.
   - Include a clear explanation.

2. If Question format is "CODING":
   - Generate ONLY coding questions.
   - Every question must have type "CODING".
   - options must be null.
   - correctAnswer must be null.
   - The question should clearly describe the programming problem.
   - Include constraints and expected input/output where appropriate.
   - The explanation should describe the expected approach or solution concept.

3. If Question format is "SUBJECTIVE":
   - Generate ONLY subjective questions.
   - Every question must have type "SUBJECTIVE".
   - options must be null.
   - correctAnswer must be null.
   - The explanation should describe the important points that a strong answer should contain.

4. If Question format is "MIXED":
   - Generate a mixture of MCQ, CODING and SUBJECTIVE questions.
   - Do NOT generate only one question type.
   - Use a reasonably balanced distribution.
   - MCQ questions must follow the MCQ rules.
   - CODING questions must follow the CODING rules.
   - SUBJECTIVE questions must follow the SUBJECTIVE rules.

INTERVIEW CATEGORY RULES:

- TECHNICAL:
  Focus on software engineering, programming, DSA, databases,
  operating systems, computer networks, system design, OOP,
  backend/frontend concepts and other technical topics.

- HR:
  Focus on behavioral, communication, teamwork, leadership,
  conflict resolution, motivation, strengths/weaknesses,
  career goals and workplace situations.

- MIXED:
  Use an appropriate combination of technical and HR topics.

DIFFICULTY RULES:

- EASY:
  Fundamental concepts and straightforward problems.

- MEDIUM:
  Requires reasonable understanding and some problem solving.

- HARD:
  Requires deeper understanding, multi-step reasoning,
  optimization or advanced concepts.

OUTPUT FORMAT:

Return ONLY a valid JSON array.

Each object must have exactly this structure:

{
  "question": "string",
  "type": "MCQ" | "SUBJECTIVE" | "CODING",
  "options": ["string", "string", "string", "string"] | null,
  "correctAnswer": "string" | null,
  "explanation": "string"
}

Do not include markdown.
Do not include code fences.
Do not include any text before or after the JSON array.

Generate exactly ${input.count} questions.
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

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    const questions =
      generatedQuestionsSchema.parse(parsed);

    if (questions.length !== input.count) {
      throw new Error(
        `Gemini returned ${questions.length} questions, expected ${input.count}.`
      );
    }

    // Extra safety check:
    // Make sure Gemini respected the requested question type.
    if (input.questionType !== "MIXED") {
      const invalidQuestion =
        questions.find(
          (question) =>
            question.type !== input.questionType
        );

      if (invalidQuestion) {
        throw new Error(
          `Gemini returned ${invalidQuestion.type} question(s), expected only ${input.questionType} questions.`
        );
      }
    }

    return questions;
  }
}

export const geminiProvider =
  new GeminiProvider();