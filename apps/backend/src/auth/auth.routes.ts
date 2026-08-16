// import { Router } from "express";
// import { validate } from "../shared/middlewares/validate.middleware.js";
// import controller from "./auth.controller.js";
// import { loginSchema, registerSchema } from "./auth.schema.js";
// import router from "../routes/index.js";

// router.post("/register", validate(registerSchema), controller.register);
// router.post("/login", validate(loginSchema), controller.login);
// router.post("/refresh", controller.refresh);
// router.post("/logout", controller.logout);
import { Router } from "express";

import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import { validate } from "../shared/middleware/validate.js";
import { protect } from "./auth.middleware.js";
import { authorize } from "./authorize.middleware.js";
import { HTTP_STATUS } from "../shared/constants/http.js";
import { successResponse } from "../shared/responses/api-response.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);
router.post(
  "/logout",
  authController.logout
);
router.get(
  "/me",
  protect,
  authController.me
);
export default router;