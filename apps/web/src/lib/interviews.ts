import api from "./api";

export type InterviewType =
  | "TECHNICAL"
  | "HR"
  | "MIXED";

export type QuestionType =
  | "MCQ"
  | "CODING"
  | "SUBJECTIVE"
  | "MIXED";

export type Difficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export type CreateInterviewInput = {
  title: string;
  type: InterviewType;
  questionType: QuestionType;
  difficulty: Difficulty;
};

export const getInterviews = async () => {
  const response = await api.get("/interviews");

  return response.data;
};

export const createInterview = async (
  data: CreateInterviewInput
) => {
  const response = await api.post(
    "/interviews",
    data
  );

  return response.data;
};