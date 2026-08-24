import { z } from "zod";

const baseQuestion = {
  question: z.string().trim().min(1),
  explanation: z.string().trim().optional(),
};

const mcqQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("MCQ"),
  options: z.array(z.string().trim().min(1)).min(2),
  correctAnswer: z.string().trim().min(1),
}).superRefine((data, ctx) => {
  if (!data.options.includes(data.correctAnswer)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["correctAnswer"],
      message: "correctAnswer must be one of the options.",
    });
  }
});

const codingQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("CODING"),
  options: z.null().optional(),
  correctAnswer: z.null().optional(),
});

const subjectiveQuestionSchema = z.object({
  ...baseQuestion,
  type: z.literal("SUBJECTIVE"),
  options: z.null().optional(),
  correctAnswer: z.null().optional(),
});

export const createQuestionSchema = z.discriminatedUnion("type", [
  mcqQuestionSchema,
  codingQuestionSchema,
  subjectiveQuestionSchema,
]);

export type CreateQuestionDto =
  z.infer<typeof createQuestionSchema>;