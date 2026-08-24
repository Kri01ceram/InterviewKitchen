import type {
  AIProvider,
  GenerateQuestionsInput,
  GeneratedQuestion,
} from "./ai.types.js";

export class AIService {
  constructor(
    private readonly provider: AIProvider
  ) {}

  async generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]> {
    return this.provider.generateQuestions(input);
  }
}