import { Router } from "express";
import {
  getTrackers,
  createTracker,
  deleteTracker,
  updateTracker,
} from "../controllers/trackerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getTrackers).post(createTracker);

router.route("/:id").delete(deleteTracker).patch(updateTracker);

export default router;
