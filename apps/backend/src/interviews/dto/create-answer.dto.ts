import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.string().min(1),
});

export type CreateAnswerDto = z.infer<
  typeof createAnswerSchema
>;