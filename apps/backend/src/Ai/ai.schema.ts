import { z } from "zod";

const mcqQuestionSchema = z.object({
  question: z.string().min(1),
  type: z.literal("MCQ"),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
});

const subjectiveQuestionSchema = z.object({
  question: z.string().min(1),
  type: z.literal("SUBJECTIVE"),
  options: z.null(),
  correctAnswer: z.null(),
  explanation: z.string().optional(),
});

const codingQuestionSchema = z.object({
  question: z.string().min(1),
  type: z.literal("CODING"),
  options: z.null(),
  correctAnswer: z.null(),
  explanation: z.string().optional(),
});

export const generatedQuestionSchema = z.discriminatedUnion(
  "type",
  [
    mcqQuestionSchema,
    subjectiveQuestionSchema,
    codingQuestionSchema,
  ]
);

export const generatedQuestionsSchema = z.array(
  generatedQuestionSchema
);

export type ValidatedGeneratedQuestion = z.infer<
  typeof generatedQuestionSchema
>;