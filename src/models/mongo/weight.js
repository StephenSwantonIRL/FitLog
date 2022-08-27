import Mongoose from "mongoose";

const { Schema } = Mongoose;

const weightSchema = new Schema({
  date: Date,
  weight: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Weight = Mongoose.model("Weight", weightSchema);
