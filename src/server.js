import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

await connectDB();

const port = env.PORT;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
