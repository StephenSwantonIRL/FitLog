import mongoose from "mongoose";
import { db } from "../models/db.js";
import { userMongoStore } from "../models/mongo/user-mongo-store.js";
import _ from "lodash";
const midnight = (date) => {
  const [dateStr] = new Date(date).toISOString().split('T')
  return new Date(dateStr.concat("T00:00:00.000+00:00"))
}


export const dashboardController = {
  index: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      let userId
      if (db.userStore === userMongoStore) {
        userId = mongoose.Types.ObjectId(request.state.fitlog.id)
      } else {
        userId = request.state.fitlog.id
      }
      const activeAllowance = await db.allowanceStore.getActiveAllowance(userId);
      const date = midnight(new Date);
      const todaysFoods = await db.logStore.getUserFoodsByDate(userId,date);
      const weights = await db.weightStore.getUserWeights(userId);
      const datesLoggedByUser = await db.logStore.getDatesLoggedByUser(userId);
      console.log(datesLoggedByUser);
      let usersFoods;
      let proteinCount = 0;
      let carbCount = 0;
      let fatCount = 0;
      if(todaysFoods[0]) {
        usersFoods = todaysFoods[0].foods.filter((food => food.user == userId));
        for ( let i= 0; i< usersFoods.length; i +=1){
          usersFoods[i].logId = todaysFoods[0]._id;
          proteinCount += parseFloat(usersFoods[i].protein);
          carbCount += parseFloat(usersFoods[i].carbs);
          fatCount += parseFloat(usersFoods[i].fat);
        }
      } else {
        usersFoods = [];
      }
      const remaining = {
          protein: activeAllowance[0].protein - proteinCount,
          carbs: activeAllowance[0].carbs - carbCount,
          fat: activeAllowance[0].fat - fatCount,
      }
      const calories = {
        fromProtein: proteinCount * 4,
        fromCarbs: carbCount *4,
        fromFat: fatCount * 9,
        total: fatCount * 9 + carbCount *4 + proteinCount * 4,
      }
      const viewData = {
        title: "FitLog Dashboard",
        user: loggedInUser,
        allowance: activeAllowance[0],
        usersFoods: usersFoods,
        remaining: remaining,
        calories: calories,
        weights: weights,
        datesLoggedByUser: datesLoggedByUser,
      };
      console.log(viewData);
      return h.view("dashboard-view", viewData);
    },
  },
  log: {
    handler: async function (request, h) {
      return h.view("log-food-view", { title: "Log Food"});
    },
  },
  saveLog: {
    /*    validate: {
          payload: PlaceSpecWithCategory,
          options: { abortEarly: false },
          failAction: function (request, h, error) {
            console.log(error.details);
            return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
          },
        },*/
    handler: async function (request, h) {
      const date = midnight(new Date());
      const loggedInUser = request.auth.credentials;
      let userId
      if (db.userStore === userMongoStore) {
        userId = mongoose.Types.ObjectId(request.state.fitlog.id)
      } else {
        userId = request.state.fitlog.id
      }
      let logId = await db.logStore.getLogByDate(date);
      if(!logId){
        await db.logStore.addDay(date, userId)
          .then(async () => logId = await db.logStore.getLogByDate(date));
      }
      //add log to today's date
      const food = request.payload;
      food.user = request.state.fitlog.id;
      const addFoodLog = await db.logStore.addFood(logId, food);
      if (addFoodLog.message) {
        const errorDetails = [{ message: addFoodLog.message }];
        return h.view("log-food-view", { title: "Error logging", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },

  deleteLog: {
    handler: async function (request, h) {
      const foodId = request.params.foodId;
      const logId = request.params.logId;
      await db.logStore.deleteFood(foodId, logId);
      return h.redirect("/dashboard");
    },
  },

  editLog: {
    handler: async function(request, h) {
      const foodId = request.params.foodId;
      const logId = request.params.logId;

      const f = await db.logStore.getFoods(logId);
      const foodDetails = f.filter(food => food._id == foodId)
      console.log(foodDetails);
      return h.view("edit-log-view", { logId: logId, foodId: foodId, food: foodDetails[0] });
    },
  },

  updateLog: {
    handler: async function (request, h) {
      const foodId = request.params.foodId;
      const food = request.payload
      food.user = request.state.fitlog.id;
      console.log(food);
      const logId = request.params.logId;
      const logObject = await db.logStore.getLogById(request.params.logId);
      await db.logStore.deleteFood(foodId, logId)
      await db.logStore.addFood(logObject, food);
      return h.redirect("/dashboard");
    },
  },

  addWeight: {
    handler: async function (request, h) {
      let userId
      if (db.userStore === userMongoStore) {
        userId = mongoose.Types.ObjectId(request.state.fitlog.id)
      } else {
        userId = request.state.fitlog.id
      }
      const weight = request.payload;
      weight.user = request.state.fitlog.id;
      const w = await db.weightStore.addWeight(weight);
      if (w.message) {
        const errorDetails = [{ message: w.message }];
      }
      return h.redirect("/dashboard");
    },
  },

}