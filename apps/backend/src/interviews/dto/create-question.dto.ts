import { z } from "zod";

export const createQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters.")
    .max(2000, "Question must not exceed 2000 characters."),

  type: z.enum(["MCQ", "CODING", "SUBJECTIVE"]),

  options: z.array(z.string()).optional(),

  correctAnswer: z.string().optional(),

  explanation: z.string().max(2000).optional(),
});

export type CreateQuestionDto = z.infer<
  typeof createQuestionSchema
>;