import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import healthController from "./health.controller.js";

const router = Router();

router.get("/", healthController.getHealth);

export default router;