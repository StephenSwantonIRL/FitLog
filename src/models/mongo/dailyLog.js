import Mongoose from "mongoose";

const { Schema } = Mongoose;

const logSchema = new Schema({
  date: Date,
  foods: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: "food",
    },
    quantity: Number,
  }],
});

export const DailyLog = Mongoose.model("Daily Log", logSchema);
