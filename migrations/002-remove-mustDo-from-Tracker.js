export const name = "002-remove-mustDo-from-Tracker";

export async function up(db) {
  const trackers = db.collection("trackers");

  console.log("Removing mustDo from Tracker...");

  const result = await trackers.updateMany(
    { mustDo: { $exists: true } },
    { $unset: { mustDo: "" } },
  );

  console.log(`Removed mustDo from ${result.modifiedCount} Tracker documents`);
}

export async function down(db) {
  const trackers = db.collection("trackers");

  console.log("Rolling back: adding mustDo back to Tracker...");

  const result = await trackers.updateMany(
    { mustDo: { $exists: false } },
    { $set: { mustDo: true } },
  );

  console.log("Rollback finished");
}
