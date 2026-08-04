import { Router } from "express";
import {
  getTrackers,
  createTracker,
} from "../controllers/trackerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getTrackers).post(createTracker);

export default router;
