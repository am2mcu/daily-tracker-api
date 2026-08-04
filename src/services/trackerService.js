import Tracker from "../models/trackerModel.js";
import { BadRequest, NotFoundError } from "../utils/errors.js";

export const getTrackers = async (userId) =>
  await Tracker.find({ user: userId });

export const createTracker = async (userId, data) => {
  const { title } = data;
  const newTracker = await Tracker.create({ title, user: userId });
  return newTracker;
  src / controllers / trackerController.js;
};
