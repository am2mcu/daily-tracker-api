import { Router } from "express";
import {
  getTrackers,
  createTracker,
  deleteTracker,
  updateTracker,
  checkDate,
} from "../controllers/trackerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getTrackers).post(createTracker);

router.route("/:id").delete(deleteTracker).patch(updateTracker).post(checkDate);

export default router;
