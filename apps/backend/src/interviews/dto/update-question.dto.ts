import { z } from "zod";

export const updateQuestionSchema = z.object({
  question: z.string().min(1).optional(),
  type: z.enum(["MCQ", "SUBJECTIVE", "CODING"]).optional(),
  options: z.array(z.string()).nullable().optional(),
  correctAnswer: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
});

export type UpdateQuestionDto = z.infer<
  typeof updateQuestionSchema
>;