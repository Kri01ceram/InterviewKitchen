import { z } from "zod";

export const createQuestionSchema = z.object({
  question: z.string().min(1),

  type: z.enum([
    "MCQ",
    "CODING",
    "SUBJECTIVE",
  ]),

  options: z
    .array(z.string())
    .nullable()
    .optional(),

  correctAnswer: z
    .string()
    .nullable()
    .optional(),

  explanation: z
    .string()
    .nullable()
    .optional(),
});

export type CreateQuestionDto = z.infer<
  typeof createQuestionSchema
>;