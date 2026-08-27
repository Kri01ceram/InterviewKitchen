import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";

import { createQuestionSchema } from "./dto/create-question.dto.js";
import { questionController } from "./question.controller.js";
import { updateQuestionSchema } from "./dto/update-question.dto.js";

import { generateQuestionsSchema } from "./dto/generate-questions.dto.js";

const router = Router({ mergeParams: true });

router.use(protect);

router.post(
  "/",
  validate(createQuestionSchema),
  questionController.create
);

router.get(
  "/",
  questionController.getAll
);

router.patch(
  "/:id",
  validate(updateQuestionSchema),
  questionController.update
);

router.delete(
  "/:id",
  questionController.delete
);

router.get(
  "/:id",
  questionController.getById
);
router.post(
  "/generate",
  validate(generateQuestionsSchema),
  questionController.generate
);

export default router;