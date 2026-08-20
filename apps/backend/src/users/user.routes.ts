import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { userController } from "./user.controller.js";

const router = Router();

router.get(
  "/me",
  protect,
  userController.getMe
);

export default router;