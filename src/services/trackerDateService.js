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
    return await updateTrackerDate(trackerDate.id, {
      isDone: !trackerDate.isDone,
    });
  }

  return await TrackerDate.create({ date, isDone: true, tracker: trackerId });
};

export const updateTrackerDate = async (id, data) => {
  const { isDone, note } = data;
  const trackerDate = await TrackerDate.findByIdAndUpdate(
    id,
    { isDone, note },
    { returnDocument: "after", runValidators: true },
  );
  return trackerDate;
};

export const deleteTrackerDate = async (id) => {
  const trackerDate = await TrackerDate.findByIdAndDelete(id);
  return trackerDate;
};

export const deleteTrackerDates = async (trackerId) => {
  const trackerDates = await TrackerDate.deleteMany({ tracker: trackerId });
  return trackerDates;
};
