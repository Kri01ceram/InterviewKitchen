import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";

import { createQuestionSchema } from "./dto/create-question.dto.js";
import { questionController } from "./question.controller.js";

const router = Router();

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

router.get(
  "/:id",
  questionController.getById
);

export default router;