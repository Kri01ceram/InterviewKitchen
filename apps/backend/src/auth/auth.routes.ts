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

import { authController } from "./auto.controller.js";

const router = Router();

router.post("/register", authController.register);

export default router;