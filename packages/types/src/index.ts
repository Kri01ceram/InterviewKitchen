export type InterviewType = "TECHNICAL" | "HR" | "MIXED";
export type QuestionType = "MCQ" | "CODING" | "SUBJECTIVE" | "MIXED";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type InterviewStatus = "CREATED" | "IN_PROGRESS" | "COMPLETED";

export type InterviewSettings = {
  type: InterviewType;
  questionType: QuestionType;
  difficulty: Difficulty;
};