import Mongoose from "mongoose";

const { Schema } = Mongoose;

const allowanceSchema = new Schema({
  startDate: Date,
  endDate: Date,
  protein: Number,
  carbs: Number,
  fat: Number,
  veggie: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Allowance = Mongoose.model("Allowance", allowanceSchema);
