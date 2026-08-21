import { z } from "zod";

export const createInterviewSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(100, "Title must not exceed 100 characters."),

  type: z.enum(["TECHNICAL", "HR", "MIXED"]),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

export type CreateInterviewDto = z.infer<typeof createInterviewSchema>;