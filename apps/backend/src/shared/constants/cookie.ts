import { env } from "../../config/env.js";
import { AUTH_CONSTANTS } from "./auth.js";

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production"
    ? ("none" as const)
    : ("lax" as const),
  maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
};