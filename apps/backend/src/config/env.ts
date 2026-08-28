import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(
    32,
    "JWT_ACCESS_SECRET must be at least 32 characters."
  ),

  JWT_REFRESH_SECRET: z.string().min(
    32,
    "JWT_REFRESH_SECRET must be at least 32 characters."
  ),

  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().optional(),
  FRONTEND_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);