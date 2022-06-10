/* eslint-disable no-else-return */
import _ from "lodash";
import { DailyLog } from "./dailyLog.js";
import { foodMongoStore } from "./food-mongo-store.js";


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
    const operation = new DailyLog(newCategory);
    const returnedDay = await operation.save();
    return this.getLogById(returnedDay._id);
  },

  async addFood(id, logId, quantity) {
    if (!id || !logId || !quantity) {
      return new Error("Incomplete information provided");
    } else {
      const log = await this.getLogById(logId);
      const food = await foodMongoStore.getFoodById(id);
      if (log === null || food === null) {
        return new Error("Unable to find DailyLog or Food item");
      } else {
        await DailyLog.updateOne({ _id: logId }, { foods: {$push: { id: id, quantity: quantity } }});
        const outcome = await this.getLogById(logId);
        return outcome;
      }
    }
  },


  async getFoods(id) {
    const log = await DailyLog.find({ _id: id }).lean();
    const f = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < log[0].foods.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const fd = await foodMongoStore.getfoodById(log[0].foods[i]);
      f.push(fd);
    }
    return f;
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
        return new Error("Unable to find Category");
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
