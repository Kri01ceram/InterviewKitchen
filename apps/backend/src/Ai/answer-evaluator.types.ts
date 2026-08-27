export type EvaluateAnswerInput = {
  question: string;
  expectedAnswer: string | null;
  userAnswer: string;
  questionType: "SUBJECTIVE" | "CODING";
};

export type AnswerEvaluation = {
  isCorrect: boolean;
  score: number;
  feedback: string;
};

export interface AnswerEvaluator {
  evaluateAnswer(
    input: EvaluateAnswerInput
  ): Promise<AnswerEvaluation>;
}