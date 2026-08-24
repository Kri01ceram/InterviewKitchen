import { z } from "zod";

export const updateAnswerSchema = z.object({
  isCorrect: z.boolean().nullable().optional(),

  score: z
    .number()
    .min(0)
    .max(10)
    .nullable()
    .optional(),

  feedback: z.string().nullable().optional(),
});

export type UpdateAnswerDto =
  z.infer<typeof updateAnswerSchema>;