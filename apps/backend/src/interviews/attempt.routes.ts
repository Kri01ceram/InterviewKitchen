import { Router } from "express";
import { protect } from "../auth/auth.middleware.js";
import { attemptController } from "./attempt.controller.js";

const router = Router({ mergeParams: true });

router.use(protect);

router.post(
  "/",
  attemptController.create
);

router.get(
  "/",
  attemptController.getAll
);

router.get(
  "/:id",
  attemptController.getById
);

export default router;