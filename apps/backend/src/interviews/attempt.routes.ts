import { Router } from "express";
import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";
import { createAttemptSchema } from "./dto/create-attempt.dto.js";
import { attemptController } from "./attempt.controller.js";

const router = Router({
  mergeParams: true,
});

router.use(protect);

router.post(
  "/",
  validate(createAttemptSchema),
  attemptController.create
);

router.get(
  "/",
  attemptController.getAll
);

router.get(
  "/:attemptId",
  attemptController.getById
);

router.patch(
  "/:attemptId/complete",
  attemptController.complete
);
router.get(
  "/:attemptId/result",
  attemptController.getResult
);
export default router;