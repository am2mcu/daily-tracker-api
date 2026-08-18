export const name = "001-move-checkedDates-to-TrackerDate";

export async function up(db) {
  const trackers = db.collection("trackers");
  const trackerDates = db.collection("trackerdates");

  console.log("Moving checkedDates → TrackerDate...");

  const cursor = trackers.find({ checkedDates: { $exists: true } });

  let moved = 0;

  for await (const tracker of cursor) {
    const checkedDates = tracker.checkedDates;

    if (!checkedDates) continue;

    const docs = checkedDates.map((date) => ({
      trackerId: tracker._id,
      date: date,
      isDone: true,
      createdAt: tracker.createdAt,
    }));

    if (docs.length > 0) {
      await trackerDates.insertMany(docs);
      moved += docs.length;
    }
  }

  console.log(`Created ${moved} documents in TrackerDate`);

  const result = await trackers.updateMany(
    { checkedDates: { $exists: true } },
    { $unset: { checkedDates: "" } },
  );

  console.log(
    `Removed checkedDates from ${result.modifiedCount} Tracker documents`,
  );
}

export async function down(db) {
  const trackers = db.collection("trackers");
  const trackerDates = db.collection("trackerdates");

  console.log("Rolling back: moving data back to Tracker.checkedDates...");

  const grouped = await trackerDates
    .aggregate([
      {
        $group: {
          _id: "$trackerId",
          dates: { $push: "$date" },
        },
      },
    ])
    .toArray();

  for (const group of grouped) {
    await trackers.updateOne(
      { _id: group._id },
      { $set: { checkedDates: group.dates } },
    );
  }

  await trackerDates.deleteMany({});
  console.log("Rollback finished");
}
