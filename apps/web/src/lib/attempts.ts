import api from "./api";

export type Attempt = {
  id: string;
  interviewId: string;
  userId: string;
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  createdAt: string;
};

export const createAttempt = async (
  interviewId: string
) => {
  const response = await api.post(
    `/interviews/${interviewId}/attempts`
  );

  return response.data;
};

export const getAttempts = async (
  interviewId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/attempts`
  );

  return response.data;
};

export const getAttempt = async (
  interviewId: string,
  attemptId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/attempts/${attemptId}`
  );

  return response.data;
};

export const completeAttempt = async (
  interviewId: string,
  attemptId: string
) => {
  const response = await api.patch(
    `/interviews/${interviewId}/attempts/${attemptId}/complete`
  );

  return response.data;
};

export const getAttemptResult = async (
  interviewId: string,
  attemptId: string
) => {
  const response = await api.get(
    `/interviews/${interviewId}/attempts/${attemptId}/result`
  );

  return response.data;
};