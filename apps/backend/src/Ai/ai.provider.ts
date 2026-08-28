import type {
  AIProvider,
  GenerateQuestionsInput,
  GeneratedQuestion,
} from "./ai.types.js";
import { AIService } from "./ai.service.js";
import { GeminiProvider } from "./gemini.provider.js";

export class MockAIProvider implements AIProvider {
  async generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]> {
    const type =
      input.questionType === "MIXED"
        ? "SUBJECTIVE"
        : input.questionType;

    return Array.from(
      { length: input.count },
      (_, index) => {
        if (type === "MCQ") {
          return {
            question: `Sample ${input.type} MCQ question ${index + 1}`,
            type: "MCQ" as const,
            options: [
              "Option A",
              "Option B",
              "Option C",
              "Option D",
            ],
            correctAnswer: "Option A",
            explanation: "Sample explanation.",
          };
        }

        if (type === "CODING") {
          return {
            question: `Sample ${input.type} coding question ${index + 1}`,
            type: "CODING" as const,
            options: null,
            correctAnswer: null,
            explanation: undefined,
          };
        }

        return {
          question: `Sample ${input.type} subjective question ${index + 1}`,
          type: "SUBJECTIVE" as const,
          options: null,
          correctAnswer: null,
          explanation: undefined,
        };
      }
    );
  }
}

export const aiProvider =
  new GeminiProvider();

export const aiService =
  new AIService(aiProvider);