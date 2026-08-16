import { Schema, model } from "mongoose";

const trackerDateSchema = new Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    isDone: {
      type: Boolean,
      required: [true, "isDone is required"],
    },
    note: {
      type: String,
      trim: true,
    },
    tracker: {
      type: Schema.Types.ObjectId,
      ref: "Tracker",
      required: [true, "Tracker is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

export default model("TrackerDate", trackerDateSchema);
