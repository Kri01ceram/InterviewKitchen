import { Router } from "express";
import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";
import { createAnswerSchema } from "./dto/create-answer.dto.js";
import { answerController } from "./answer.controller.js";


const router = Router({
  mergeParams: true,
});

router.use(protect);

router.post(
  "/",
  validate(createAnswerSchema),
  answerController.create
);

router.get(
  "/",
  answerController.getAll
);
router.patch(
  "/:answerId",
  answerController.evaluate
);
export default router;