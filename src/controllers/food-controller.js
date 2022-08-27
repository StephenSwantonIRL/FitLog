/* eslint-disable no-await-in-loop */
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { userMongoStore } from "../models/mongo/user-mongo-store.js";
import mongoose from "mongoose";

export const foodController = {

  add: {
    handler: async function (request, h) {
      return h.view("create-food-view", { title: "Add a New Food"});
    },
  },
  edit: {
    auth: false,
    handler: async function (request, h) {
      const food = await db.foodStore.getFoodById(request.params.id);
      console.log(food);
      return h.view("edit-food-view", { title: "Editing", food: food });
    },
  },
  save: {
/*    validate: {
      payload: PlaceSpecWithCategory,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
      },
    },*/
    handler: async function (request, h) {
      const food = request.payload;
      food.createdBy = request.state.fitlog.id;
      const addFood = await db.foodStore.addFood(food);
      if (addFood.message) {
        const errorDetails = [{ message: addFood.message }];
        return h.view("edit-food-view", { title: "Error Saving New food", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },
  saveEdited: {
    /*validate: {
      payload: PlaceSpecWithCategory,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
      },
    },*/
    handler: async function (request, h) {
      const updatedFood = request.payload;
      updatedFood.createdBy = request.state.fitlog.id;
      const updateFood = await db.foodStore.updateFood(request.params.id, updatedFood);
      if (updateFood.message) {
        const errorDetails = [{ message: updateFood.message }];
        return h.view("edit-food-view", { title: "Error Updating Food", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },
  delete: {
    handler: async function (request, h) {
      const createdBy = request.state.fitlog.id;
      await db.foodStore.deleteFoodById(request.params.id, createdBy);
      return h.redirect("/dashboard");
    },
  },

  findOne: {
    handler: async function (request, h) {
      try {
        const food = await db.foodStore.getFoodById(request.params.id);
        if (!food) {
          return Boom.notFound("Nothing with this id");
        }
        return food;
      } catch (err) {
        return Boom.serverUnavailable("Nothing with this id");
      }
    },

  },

  searchFood: {
    handler: async function (request, h) {
      const query = request.payload.searchValue;
      const results = await db.foodStore.searchFoodNames(query);
      console.log(results);
      return results;
    },
  },


};
