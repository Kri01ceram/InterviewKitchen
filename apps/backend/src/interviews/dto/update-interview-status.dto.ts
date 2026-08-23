import { z } from "zod";

export const updateInterviewStatusSchema = z.object({
  status: z.enum([
    "CREATED",
    "IN_PROGRESS",
    "COMPLETED",
  ]),
});

export type UpdateInterviewStatusDto = z.infer<
  typeof updateInterviewStatusSchema
>;