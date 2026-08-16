import { Types } from "mongoose";
import Tracker from "../models/trackerModel.js";
import { getToday } from "../utils/date/dateHandler.js";
import { BadRequest, NotFoundError } from "../utils/errors.js";
import {
  addTrackerDate,
  deleteTrackerDates,
  getTrackerDates,
  updateTrackerDateBydate,
} from "./trackerDateService.js";
import { date } from "zod";

export const getTrackers = async (userId) => {
  const trackers = await Tracker.find({ user: userId });

  const updatedTrackers = await Promise.all(
    trackers.map(async (tracker) => {
      const trackerDates = await getTrackerDates(tracker.id);
      return {
        id: tracker.id,
        title: tracker.title,
        mustDo: tracker.mustDo,
        checkedDates: trackerDates,
      };
    }),
  );

  return updatedTrackers;
};

export const createTracker = async (userId, data) => {
  const { title, mustDo } = data;
  const newTracker = await Tracker.create({ title, user: userId, mustDo });
  return newTracker;
};

export const deleteTracker = async (userId, trackerId) => {
  const tracker = await Tracker.deleteOne({ _id: trackerId, user: userId });
  await deleteTrackerDates(trackerId);
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

export const checkDate = async (userId, trackerId) => {
  const tracker = await Tracker.findOne({ _id: trackerId, user: userId });
  const today = getToday();

  await addTrackerDate(tracker.id, today);
  return tracker;
};

export const updateTrackerDate = async (userId, trackerId, date, data) => {
  const tracker = await Tracker.findOne({ user: userId });

  await updateTrackerDateBydate(tracker.id, date, data);

  return tracker;
};
