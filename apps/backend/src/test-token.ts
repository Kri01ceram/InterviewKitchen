import "dotenv/config";

import { tokenService } from "./auth/token.service.js";

async function main() {
  const accessToken = await tokenService.generateAccessToken({
    userId: "123",
    email: "krishna@test.com",
    role: "USER",
  });

  console.log(accessToken);

  const decoded = await tokenService.verifyAccessToken(accessToken);

  console.log(decoded);
}

main();