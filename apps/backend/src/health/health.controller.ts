import { Request, Response } from "express";
import healthService from "./health.service.js";

class HealthController {
  getHealth(_req: Request, res: Response) {
    res.json(healthService.getStatus());
  }
}

export default new HealthController();