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

export const deleteTracker = asyncHandler(async (req, res, next) => {
  const tracker = await trackerService.deleteTracker(
    req.user.id,
    req.params.id,
  );

  res.status(204).json(null);
});

export const updateTracker = asyncHandler(async (req, res, next) => {
  const tracker = await trackerService.updateTracker(
    req.user.id,
    req.params.id,
    req.body,
  );

  res.status(200).json({ status: "success", data: { tracker } });
});

export const checkDate = asyncHandler(async (req, res, next) => {
  const tracker = await trackerService.checkDate(
    req.user.id,
    req.params.id,
    req.body,
  );

  res.status(200).json({ status: "success", data: { tracker } });
});

export const updateTrackerDate = asyncHandler(async (req, res, next) => {
  const tracker = await trackerService.updateTrackerDate(
    req.user.id,
    req.params.id,
    req.params.date,
    req.body,
  );

  res.status(200).json({ status: "success", data: { tracker } });
});
