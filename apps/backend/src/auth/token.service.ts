import { JWTPayload, SignJWT, jwtVerify } from "jose";
import type { JwtPayload } from "./auth.types.js";
import AppError from "../shared/errors/AppError.js";
import { env } from "../config/env.js";
import { AUTH_CONSTANTS } from "../shared/constants/auth.js";

class TokenService {
    private getSecret(secret: string | undefined, name: string): Uint8Array {
  if (!secret) {
    throw new Error(`${name} is not configured.`);
  }

  return new TextEncoder().encode(secret);
}
  private readonly accessSecret = this.getSecret(
  env.JWT_ACCESS_SECRET,
  "JWT_ACCESS_SECRET"
);

private readonly refreshSecret = this.getSecret(
  env.JWT_REFRESH_SECRET,
  "JWT_REFRESH_SECRET"
);

private validatePayload(
  payload: JWTPayload
): JwtPayload {
  if (
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "USER" &&
      payload.role !== "ADMIN")
  ) {
    throw new AppError(
      "Invalid JWT payload.",
      401
    );
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime(AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY)
      .sign(this.accessSecret);
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime(AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY)
      .sign(this.refreshSecret);
  }

async verifyAccessToken(
  token: string
): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      this.accessSecret
    );

    return this.validatePayload(payload);
  } catch {
    throw new AppError(
      "Invalid or expired access token.",
      401
    );
  }
}

  async verifyRefreshToken(
  token: string
): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(
      token,
      this.refreshSecret
    );

    return this.validatePayload(payload);
  } catch {
    throw new AppError(
      "Invalid or expired refresh token.",
      401
    );
  }
}
}

export const tokenService = new TokenService();