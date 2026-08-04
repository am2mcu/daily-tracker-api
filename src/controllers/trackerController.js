import asyncHandler from "../utils/asyncHandler.js";
import * as trackerService from "../services/trackerService.js";

export const getTrackers = asyncHandler(async (req, res, next) => {
  const trackers = await trackerService.getTrackers(req.user.id);

  res.status(200).json({ status: "success", data: { trackers } });
});

export const createTracker = asyncHandler(async (req, res, next) => {
  const tracker = await trackerService.createTracker(req.user.id, req.body);

  res.status(201).json({ status: "success", data: { tracker } });
});
