import { Schema, model } from "mongoose";

const trackerSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    checkedDates: [
      {
        type: Date,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
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

export default model("Tracker", trackerSchema);
