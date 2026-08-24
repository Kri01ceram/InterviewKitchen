export type GenerateQuestionsInput = {
  type: string;
  difficulty: string;
  count: number;
};

export type GeneratedQuestion = {
  question: string;
  type: "MCQ" | "SUBJECTIVE";
  options: string[] | null;
  correctAnswer: string | null;
  explanation: string | null;
};

export type AIProvider = {
  generateQuestions(
    input: GenerateQuestionsInput
  ): Promise<GeneratedQuestion[]>;
};