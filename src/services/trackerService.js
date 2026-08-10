import Tracker from "../models/trackerModel.js";
import { getToday } from "../utils/date/dateHandler.js";
import { BadRequest, NotFoundError } from "../utils/errors.js";

export const getTrackers = async (userId) => {
  const today = getToday();
  const trackers = Tracker.aggregate([
    {
      $addFields: {
        hasToday: {
          $cond: {
            if: { $in: [today, "$checkedDates"] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    { $sort: { hasToday: 1 } },
    { $set: { id: "$_id" } },
    { $unset: ["hasToday", "_id", "__v"] },
  ]);

  return trackers;
};

export const createTracker = async (userId, data) => {
  const { title, mustDo } = data;
  const newTracker = await Tracker.create({ title, user: userId, mustDo });
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

export const checkDate = async (userId, trackerId) => {
  const tracker = await Tracker.findOne({ _id: trackerId, user: userId });

  const today = getToday();

  if (tracker.checkedDates.includes(today))
    return await Tracker.findOneAndUpdate(
      { _id: trackerId, user: userId },
      { $pull: { checkedDates: today } },
      { returnDocument: "after", runValidators: true },
    );

  return await Tracker.findOneAndUpdate(
    { _id: trackerId, user: userId },
    { $push: { checkedDates: today } },
    { returnDocument: "after", runValidators: true },
  );
};
