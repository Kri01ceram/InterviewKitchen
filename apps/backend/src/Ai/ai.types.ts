import type { CreateQuestionDto } from "../interviews/dto/create-question.dto.js";

export type GenerateQuestionsInput = {
  type: "TECHNICAL" | "HR" | "MIXED";
  questionType: "MCQ" | "CODING" | "SUBJECTIVE" | "MIXED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  count: number;
};

export type GeneratedQuestion = CreateQuestionDto;

export type AIProvider = {
  generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]>;
};