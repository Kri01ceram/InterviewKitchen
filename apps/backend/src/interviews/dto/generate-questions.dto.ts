import { z } from "zod";

export const generateQuestionsSchema = z.object({
  count: z
    .number()
    .int()
    .min(1)
    .max(20),
});

export type GenerateQuestionsDto =
  z.infer<typeof generateQuestionsSchema>;