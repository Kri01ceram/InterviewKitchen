import type { JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface RefreshTokenPayload extends AccessTokenPayload {
  sid: string;
}