import { z } from "zod";

export const updateAnswerSchema = z.object({
  isCorrect: z.boolean(),
  score: z.number().min(0).max(10),
  feedback: z.string().min(1).max(1000),
});

export type UpdateAnswerDto =
  z.infer<typeof updateAnswerSchema>;