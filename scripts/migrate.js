import "dotenv/config";
import mongoose from "mongoose";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, "../migrations");
const CHANGELOG_COLLECTION = "migrations";

async function main() {
  const direction = process.argv[2];

  if (!["up", "down"].includes(direction)) {
    console.error("Usage: node scripts/migrate.js up|down");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const changelog = db.collection(CHANGELOG_COLLECTION);

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".js"))
    .sort();

  const applied = await changelog.find({}).toArray();
  const appliedNames = new Set(applied.map((m) => m.name));

  if (direction === "up") {
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const migration = await import(pathToFileURL(filePath).href);

      const { name, up } = migration;

      if (!name || typeof up !== "function") {
        console.error(`Invalid migration file: ${file}`);
        continue;
      }

      if (appliedNames.has(name)) {
        console.log(`⏭  Skipping ${name} (already applied)`);
        continue;
      }

      console.log(`↑  Running ${name}`);
      await up(db);

      await changelog.insertOne({
        name,
        appliedAt: new Date(),
      });

      console.log(`✓  ${name} applied`);
    }
  }

  if (direction === "down") {
    const last = await changelog.find().sort({ appliedAt: -1 }).limit(1).next();

    if (!last) {
      console.log("No migrations to roll back");
      await mongoose.disconnect();
      return;
    }

    let migration = null;
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const mod = await import(pathToFileURL(filePath).href);
      if (mod.name === last.name) {
        migration = mod;
        break;
      }
    }

    if (!migration || typeof migration.down !== "function") {
      throw new Error(`Could not find down() for migration: ${last.name}`);
    }

    console.log(`↓  Rolling back ${migration.name}`);
    await migration.down(db);

    await changelog.deleteOne({ name: migration.name });
    console.log(`✓  ${migration.name} rolled back`);
  }

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
