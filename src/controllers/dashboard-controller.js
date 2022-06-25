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
      let usersFoods;
      if(todaysFoods[0]) {
        usersFoods = todaysFoods[0].foods.filter((food => food.user == userId));
        for ( let i= 0; i< usersFoods.length; i +=1){
          usersFoods[i].logId = todaysFoods[0]._id;
        }
      } else {
        usersFoods = [];
      }
      const viewData = {
        title: "FitLog Dashboard",
        user: loggedInUser,
        allowance: activeAllowance[0],
        usersFoods: usersFoods,
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

}