/* eslint-disable no-await-in-loop */
import Boom from "@hapi/boom";
import { PlaceSpec, PlaceSpecWithCategory } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { userMongoStore } from "../models/mongo/user-mongo-store.js";
import mongoose from "mongoose";

export const placeController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Place" });
    },
  },
  add: {
    handler: async function (request, h) {
      const categories = await db.categoryStore.getAllCategories();
      return h.view("create-place-view", { title: "Create a New PlaceMark", categories: categories });
    },
  },
  edit: {
    auth: false,
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceById(request.params.id);
      const categories = await db.categoryStore.getCategoriesByPlace(place._id);
      const categorylist = await db.categoryStore.getAllCategories();
      if (categories.length > 0) {
        let placeCategories = "";
        for (let i = 0; i < categories.length; i += 1) {
          placeCategories = placeCategories.concat(categories[i].name);
          if (i < categories.length - 1) {
            placeCategories = placeCategories.concat(", ");
          }
        }
        place.categories = placeCategories;
      }
      return h.view("edit-place-view", { title: "Editing", place: place, images: place.images, categories: categorylist });
    },
  },
  save: {
    validate: {
      payload: PlaceSpecWithCategory,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const place = request.payload;
      if (request.payload.images) {
        const imageString = request.payload.images;
        const imageArray = imageString.split(",");
        imageArray.pop();
        place.images = imageArray;
      }
      place.createdBy = request.state.placemark.id;
      const addPlace = await db.placeStore.addPlace(place);
      if (addPlace.message) {
        const errorDetails = [{ message: addPlace.message }];
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: errorDetails }).takeover().code(400);
      }
      let categories;
      if (request.payload.categories === "") {
        categories = [];
      } else {
        categories = JSON.parse(request.payload.categories);
      }
      for (let i = 0; i < categories.length; i += 1) {
        const category = await db.categoryStore.getCategoryByName(categories[i].value);
        await db.categoryStore.addPlace(addPlace._id, category._id);
      }
      return h.redirect("/dashboard");
    },
  },
  saveEdited: {
    validate: {
      payload: PlaceSpecWithCategory,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const updatedPlace = request.payload;
      if (request.payload.images) {
        const imageString = request.payload.images;
        const imageArray = imageString.split(",");
        imageArray.pop();
        updatedPlace.images = imageArray;
      }
      updatedPlace.createdBy = request.state.placemark.id;
      const updatePlace = await db.placeStore.updatePlace(request.params.id, updatedPlace);
      if (updatePlace.message) {
        const errorDetails = [{ message: updatePlace.message }];
        return h.view("edit-place-view", { title: "Error Updating PlaceMark", errors: errorDetails }).takeover().code(400);
      }
      const originalCategories = await db.categoryStore.getCategoriesByPlace(request.params.id);
      if (originalCategories) {
        for (let i = 0; i < originalCategories.length; i += 1) {
          await db.categoryStore.deletePlace(request.params.id, originalCategories[i]._id);
        }
      }
      let categories;
      if (request.payload.categories === "") {
        categories = [];
      } else {
        categories = JSON.parse(request.payload.categories);
      }
      for (let i = 0; i < categories.length; i += 1) {
        const category = await db.categoryStore.getCategoryByName(categories[i].value);
        await db.categoryStore.addPlace(request.params.id, category._id);
      }
      return h.redirect("/dashboard");
    },
  },
  delete: {
    handler: async function (request, h) {
      const createdBy = request.state.placemark.id;
      await db.placeStore.deletePlaceById(request.params.id, createdBy);
      const categories = await db.categoryStore.getCategoriesByPlace(request.params.id);
      if (categories) {
        for (let i = 0; i < categories.length; i += 1) {
          await db.categoryStore.deletePlace(request.params.id, categories[i]._id);
        }
      }

      return h.redirect("/dashboard");
    },
  },

  findOne: {
    handler: async function (request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No PlaceMark with this id");
        }
        const returnedCategories = await db.categoryStore.getCategoriesByPlace(place._id);
        place.categories = returnedCategories;
        console.log(place);
        return place;
      } catch (err) {
        return Boom.serverUnavailable("No PlaceMark with this id");
      }
    },
  },
  uploadImage: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          return { url: url };
        }
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  viewByCategory: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userId
      if( db.userStore === userMongoStore) {
        userId = mongoose.Types.ObjectId(request.state.placemark.id)
      } else {
        userId = request.state.placemark.id
      }
      const isAdmin = await db.userStore.checkAdmin(userId);
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const places  = await db.categoryStore.getPlaces(request.params.id)
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        category: category,
        isAdmin: isAdmin,
        places: places,
      };
      console.log(viewData)
      return h.view("category-view", viewData);
    },
  },


};
