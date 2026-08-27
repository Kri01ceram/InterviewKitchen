export type EvaluateAnswerInput = {
  question: string;
  expectedAnswer?: string | null;
  userAnswer: string;
  questionType: "SUBJECTIVE" | "CODING";
};

export type EvaluatedAnswer = {
  isCorrect: boolean;
  score: number;
  feedback: string;
};

export interface AIAnswerEvaluator {
  evaluateAnswer(
    input: EvaluateAnswerInput
  ): Promise<EvaluatedAnswer>;
}