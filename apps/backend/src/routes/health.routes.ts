import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.json({
    success: true,
    database: "connected",
  });
});

export default router;