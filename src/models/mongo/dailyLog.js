import Mongoose from "mongoose";

const { Schema } = Mongoose;

const logSchema = new Schema({
  date: Date,
  foods: [
    {
      name: String,
      protein: String,
      carbs: String,
      fat: String,
      veggie: String,
      user: String,
    }
  ]
});

export const DailyLog = Mongoose.model("Daily Log", logSchema);


/*
foods: [{
  id: {
    type: Schema.Types.ObjectId,
    ref: "Food",
  },
  quantity: Number,
}],*/
