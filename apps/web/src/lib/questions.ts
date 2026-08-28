import api from "./api";

export type QuestionType =
  | "MCQ"
  | "CODING"
  | "SUBJECTIVE";

export type Question = {
  id: string;
  interviewId: string;
  question: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswer: string | null;
  explanation: string | null;
  createdAt: string;
};

export const getQuestions = async (
  interviewId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/questions`
  );

  return response.data;
};

export const createQuestion = async (
  interviewId: string,
  data: {
    question: string;
    type: QuestionType;
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