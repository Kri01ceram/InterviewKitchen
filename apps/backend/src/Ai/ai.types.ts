import type { CreateQuestionDto } from "../interviews/dto/create-question.dto.js";

export type GenerateQuestionsInput = {
  type: string;
  difficulty: string;
  count: number;
};

export type GeneratedQuestion = CreateQuestionDto;

export type AIProvider = {
  generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]>;
};