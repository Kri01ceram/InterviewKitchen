import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";

import { createInterviewSchema } from "./dto/create-interview.dto.js";
import { interviewController } from "./interview.controller.js";

import questionRoutes from "./question.routes.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  validate(createInterviewSchema),
  interviewController.create
);

router.get(
  "/",
  interviewController.getMine
);

router.get(
  "/:id",
  interviewController.getById
);
router.use(
  "/:interviewId/questions",
  questionRoutes
);

export default router;