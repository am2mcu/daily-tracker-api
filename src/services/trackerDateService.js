import TrackerDate from "../models/trackerDateModel.js";

export const getTrackerDates = async (trackerId) => {
  const trackerDates = await TrackerDate.find({
    tracker: trackerId,
  });

  return trackerDates;
};

export const addTrackerDate = async (trackerId, date) => {
  const trackerDate = await TrackerDate.findOne({ tracker: trackerId, date });

  // delete if already exists
  if (trackerDate) {
    await deleteTrackerDate(trackerDate.id);
    return;
  }

  return await TrackerDate.create({ date, tracker: trackerId });
};

export const deleteTrackerDate = async (id) => {
  const tracker = await TrackerDate.findByIdAndDelete(id);
  return tracker;
};

export const deleteTrackerDates = async (trackerId) => {
  const TrackerDates = await TrackerDate.deleteMany({ tracker: trackerId });
  return TrackerDates;
};
