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

export type InterviewStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type CreateInterviewInput = {
  title: string;
  type: InterviewType;
  questionType: QuestionType;
  difficulty: Difficulty;
};

export type Interview = {
  id: string;
  title: string;
  type: InterviewType;
  questionType: QuestionType;
  difficulty: Difficulty;
  status: InterviewStatus;
  createdAt: string;
  updatedAt?: string;
};

export type InterviewQuestion = {
  id: string;
  question: string;
  type: "MCQ" | "CODING" | "SUBJECTIVE";
  options: string[] | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  createdAt?: string;
};

export const getInterviews = async () => {
  const response = await api.get("/interviews");
  return response.data;
};

export const getInterview = async (
  interviewId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}`
  );

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

export const getQuestions = async (
  interviewId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/questions`
  );

  return response.data;
};

export const generateQuestions = async (
  interviewId: string,
  count: number
) => {
  const response = await api.post(
    `/interviews/${interviewId}/questions/generate`,
    { count }
  );

  return response.data;
};

export const createQuestion = async (
  interviewId: string,
  data: {
    question: string;
    type:
      | "MCQ"
      | "CODING"
      | "SUBJECTIVE";
    options?: string[] | null;
    correctAnswer?: string | null;
    explanation?: string;
  }
) => {
  const response = await api.post(
    `/interviews/${interviewId}/questions`,
    data
  );

  return response.data;
};