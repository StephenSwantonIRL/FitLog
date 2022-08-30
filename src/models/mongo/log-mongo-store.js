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

  async addDay(date, userId) { //nb takes date as a string
    const newDay = {};
    newDay.date = date;
    newDay.user = userId;
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
        console.log("Log Id")
        console.log(logId._id)
        await DailyLog.updateOne({ _id: logId._id },  {$push: { foods: food }});
        const outcome = await this.getLogById(logId._id);
        return outcome;
      }
    }
  },


  async getUserFoodsByDate(userId,date) {
    const logs = await DailyLog.find({date: date, user: userId}).lean();
    return logs;

  },

  async getDatesLoggedByUser(userId) {
    const logs = await DailyLog.find({ user: userId}).distinct('date');
    return logs;

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
        await DailyLog.updateOne({ _id: logId}, { $pull: { foods: { _id: foodId } } });
        const updatedLog = await this.getLogById(logId);
        return updatedLog;
      }
    }
  },

  async deleteAll() {
    await DailyLog.deleteMany({});
  },
};
