import api from "./api";

export type Answer = {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean | null;
  score: number | null;
  feedback: string | null;
  createdAt: string;
};

export type CreateAnswerInput = {
  questionId: string;
  answer: string;
};

export const createAnswer = async (
  interviewId: string,
  attemptId: string,
  data: CreateAnswerInput
) => {
  const response = await api.post(
    `/interviews/${interviewId}/attempts/${attemptId}/answers`,
    data
  );

  return response.data;
};

export const getAnswers = async (
  interviewId: string,
  attemptId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/attempts/${attemptId}/answers`
  );

  return response.data;
};

export const evaluateAnswer = async (
  interviewId: string,
  attemptId: string,
  answerId: string
) => {
  const response = await api.patch(
    `/interviews/${interviewId}/attempts/${attemptId}/answers/${answerId}`
  );

  return response.data;
};