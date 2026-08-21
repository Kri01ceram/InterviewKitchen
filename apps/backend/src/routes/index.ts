import { Router } from "express";

import healthRoutes from "../health/health.routes.js";
import authRoutes from "../auth/auth.routes.js";
import interviewRoutes from "../interviews/interview.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/interviews", interviewRoutes);

export default router;