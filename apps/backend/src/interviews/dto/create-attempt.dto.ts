import { z } from "zod";

export const createAttemptSchema = z.object({});

export type CreateAttemptDto = z.infer<typeof createAttemptSchema>;