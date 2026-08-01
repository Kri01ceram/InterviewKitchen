import { passwordService } from "./auth/password.service.js";

async function main() {
  const password = "InterviewKitchen@2026";

  const hash = await passwordService.hashPassword(password);

  console.log(hash);

  const ok = await passwordService.verifyPassword(password, hash);

  console.log(ok);
}

main();