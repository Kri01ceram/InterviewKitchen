import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { validate } from "../shared/middleware/validate.js";

import { createInterviewSchema } from "./dto/create-interview.dto.js";
import { interviewController } from "./interview.controller.js";

import questionRoutes from "./question.routes.js";

import { updateInterviewStatusSchema } from "./dto/update-interview-status.dto.js";

import attemptRoutes from "./attempt.routes.js";

import answerRoutes from "./answer.routes.js";

const router = Router();

router.use(protect);

router.post(
  "/",
  validate(createInterviewSchema),
  interviewController.create
);
router.use(
  "/:interviewId/attempts",
  attemptRoutes
);

router.get(
  "/",
  interviewController.getMine
);
router.get(
  "/dashboard/stats",
  interviewController.getDashboardStats
);
router.get(
  "/:id",
  interviewController.getById
);
router.use(
  "/:interviewId/questions",
  questionRoutes
);
router.patch(
  "/:id/status",
  validate(updateInterviewStatusSchema),
  interviewController.updateStatus
);
router.use(
  "/:interviewId/attempts/:attemptId/answers",
  answerRoutes
);

export default router;