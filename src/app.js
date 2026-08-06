import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import meRouter from "./routes/meRouter.js";
import authRouter from "./routes/authRouter.js";
import trackerRouter from "./routes/trackerRouter.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { NotFoundError } from "./utils/errors.js";
import env from "./config/env.js";
import { authenticate } from "./middlewares/authMiddleware.js";

const app = express();

if (env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: env.ALLOWED_ORIGIN }));

app.use("/api/v1/health", (req, res, next) => {
  res.json({ status: "ok" });
});
app.use("/api/v1", authRouter);
app.use("/api/v1/me", meRouter);
// app.use("/api/v1/users", userRouter);
app.use("/api/v1/trackers", trackerRouter);

app.use((req, res, next) => {
  next(new NotFoundError(`${req.originalUrl} not found`));
});

app.use(errorMiddleware.errorHandler);

export default app;
