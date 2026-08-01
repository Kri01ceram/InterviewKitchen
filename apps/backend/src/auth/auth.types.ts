import type { JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}