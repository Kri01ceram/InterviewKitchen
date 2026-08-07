import { JWTPayload, SignJWT, jwtVerify } from "jose";
import type { AccessTokenPayload, RefreshTokenPayload } from "./auth.types.js";
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

  private validateAccessPayload(
  payload: JWTPayload
): AccessTokenPayload {
  if (
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "USER" &&
      payload.role !== "ADMIN")
  ) {
    throw new AppError("Invalid JWT payload.", 401);
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}
private validateRefreshPayload(
  payload: JWTPayload
): RefreshTokenPayload {
  if (
    typeof payload.userId !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "USER" &&
      payload.role !== "ADMIN") ||
    typeof payload.sid !== "string"
  ) {
    throw new AppError(
      "Invalid refresh token payload.",
      401
    );
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    sid: payload.sid,
  };
}

  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime(AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY)
      .sign(this.accessSecret);
  }

  async generateRefreshToken(
    payload: RefreshTokenPayload
): Promise<string> {
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
): Promise<AccessTokenPayload> {

  const { payload } = await jwtVerify(
    token,
    this.accessSecret
  );

  return this.validateAccessPayload(payload);
}

  async verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {

  const { payload } = await jwtVerify(
    token,
    this.refreshSecret
  );

  return this.validateRefreshPayload(payload);
}
}

export const tokenService = new TokenService();