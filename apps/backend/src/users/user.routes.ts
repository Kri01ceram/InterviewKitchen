import { Router } from "express";

import { protect } from "../auth/auth.middleware.js";
import { userController } from "./user.controller.js";

import { validate } from "../shared/middleware/validate.js";
import { updateProfileSchema } from "./user.validator.js";

import { changePasswordSchema } from "./user.validator.js";

const router = Router();

router.get(
  "/me",
  protect,
  userController.getMe
);
router.patch(
  "/me",
  protect,
  validate(updateProfileSchema),
  userController.updateProfile
);
router.patch(
  "/me/password",
  protect,
  validate(changePasswordSchema),
  userController.changePassword
);

export default router;