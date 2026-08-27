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
    return Array.from(
      { length: input.count },
      (_, index) => ({
        question: `Sample ${input.type} question ${index + 1}`,
        type: "SUBJECTIVE",
        options: null,
        correctAnswer: null,
        explanation: undefined,
      })
    );
  }
}

export const aiProvider =
  new GeminiProvider();

export const aiService =
  new AIService(aiProvider);