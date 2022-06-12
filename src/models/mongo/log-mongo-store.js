/* eslint-disable no-else-return */
import _ from "lodash";
import { DailyLog } from "./dailyLog.js";
import { foodMongoStore } from "./food-mongo-store.js";
import mongoose from "mongoose";

export const logMongoStore = {
  async getAllLogs() {
    const logs = await DailyLog.find().lean();
    return logs;
  },

  async getLogById(id) {
    if (id) {
      const log = await DailyLog.findOne({ _id: id }).lean();
      return log;
    }
    return null;
  },

  async addDay(date) { //nb takes a string
    const newDay = {};
    newDay.date = date;
    const operation = new DailyLog(newDay);
    const returnedDay = await operation.save();
    return this.getLogById(returnedDay._id);
  },

  async addFood(logId, food) {
    if (!logId || !food ) {
      return new Error("Incomplete information provided");
    } else {
      const log = await this.getLogById(logId);
      if (log === null) {
        return new Error("Unable to find Log");
      } else {
        await DailyLog.updateOne({ _id: logId._id },  {$push: { foods: food }});
        const outcome = await this.getLogById(logId._id);
        return outcome;
      }
    }
  },


  async getFoods(id) {
    const log = await DailyLog.findOne({ _id: id }).lean();
    return log.foods;
  },

  async getLogByDate(date) {
    const log = await DailyLog.findOne({ date: date }).lean();
    return log;
  },

  async deleteFood(foodId, logId) {
    if (!foodId || !logId) {
      return new Error("Incomplete information provided");
    } else {
      const log = await this.getLogById(logId);
      if (log === null) {
        return new Error("Unable to find Log");
      } else {
        await DailyLog.updateOne({ _id: logId }, { $pull: { foods: { $in: foodId } } });  // need to fix this query
        const updatedLog = await this.getLogById(logId);
        return updatedLog;
      }
    }
  },

  async deleteAll() {
    await DailyLog.deleteMany({});
  },
};
