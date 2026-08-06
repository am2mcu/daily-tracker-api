import Tracker from "../models/trackerModel.js";
import { BadRequest, NotFoundError } from "../utils/errors.js";

export const getTrackers = async (userId) =>
  await Tracker.find({ user: userId });

export const createTracker = async (userId, data) => {
  const { title } = data;
  const newTracker = await Tracker.create({ title, user: userId });
  return newTracker;
};

export const deleteTracker = async (userId, trackerId) => {
  const tracker = await Tracker.deleteOne({ _id: trackerId, user: userId });
  return tracker;
};

export const updateTracker = async (userId, trackerId, data) => {
  const { title } = data;
  const tracker = await Tracker.findOneAndUpdate(
    { _id: trackerId, user: userId },
    { title },
    { returnDocument: "after", runValidators: true },
  );

  return tracker;
};
