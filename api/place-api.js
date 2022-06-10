import Boom from "@hapi/boom";
import { db } from "../src/models/db.js";
import {
  PlaceArray,
  PlaceSpecAPI,
  PlaceSpecPlus,
  PlaceSpecPlusWithCategoriesObject,
  IdSpec,
} from "../src/models/joi-schemas.js";
import { validationError} from "./logger.js";

export const placeApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const places = await db.placeStore.getAllPlaces();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }

    },
    tags: ["api"],
    description: "Get all Places",
    notes: "Returns details of all Places",
    response: { schema: PlaceArray, failAction: validationError }
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No PlaceMark with this id");
        }
        const returnedCategories = await db.categoryStore.getCategoriesByPlace(place._id);
        place.categories = returnedCategories;
        console.log(place)
        return place;
      } catch (err) {
        return Boom.serverUnavailable("No PlaceMark with this id");
      }
    },
    tags: ["api"],
    description: "Gets details related to a Place",
    notes: "Returns details of a Place based on the ID provided",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlaceSpecPlusWithCategoriesObject, failAction: validationError }
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const place = request.payload;
        const newPlace = await db.placeStore.addPlace(place);
        console.log(newPlace)
        if (newPlace) {
          return h.response(newPlace).code(201);
        }
        return Boom.badImplementation("error creating place");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Creates a new Place",
    notes: "Adds a new place to the database",
    validate: { payload: PlaceSpecAPI, failAction: validationError },
    response: { schema: PlaceSpecPlus, failAction: validationError }
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        console.log("returned place")
        console.log(place)
        if (!place) {
          return Boom.notFound("No PlaceMark with this id");
        }
        await db.placeStore.deletePlaceById(place._id, place.createdBy);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No PlaceMark with this id");
      }
    },
    tags: ["api"],
    description: "Deletes a place. ",
    notes: "Deletes a place based on the place ID provided and creating user id provided",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.placeStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Deletes all places. ",
    notes: "Deletes all places from the database",
  },
  
  
};
