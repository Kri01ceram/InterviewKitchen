import { z } from "zod";

export const evaluatedAnswerSchema = z.object({
  isCorrect: z.boolean(),
  score: z.number().min(0).max(10),
  feedback: z.string().min(1),
});