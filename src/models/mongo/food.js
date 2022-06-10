import Mongoose from "mongoose";

const { Schema } = Mongoose;

const foodSchema = new Schema({
  name: String,
  amount: String,
  protein: Number,
  carbs: Number,
  fat: Number,
  veggie: Number,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Food = Mongoose.model("Food", foodSchema);
