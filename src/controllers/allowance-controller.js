import Boom from "@hapi/boom";
import { db } from "../models/db.js";

const formatDate = (date) => {
  const [dateStr] = new Date(date).toISOString().split('T')
  return dateStr
}

export const allowanceController = {

  add: {
    handler: async function(request, h) {
      return h.view("create-allowance-view", { title: "Set Daily Allowance" });
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
      const allowance = request.payload;
      allowance.user = request.state.fitlog.id;
      const addAllowance = await db.allowanceStore.addAllowance(allowance);
      if (addAllowance.message) {
        const errorDetails = [{ message: addAllowance.message }];
        return h.view("edit-allowance-view", { title: "Error Saving New food", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },
  edit: {
    auth: false,
    handler: async function (request, h) {
      const allowance = await db.allowanceStore.getAllowanceById(request.params.id);
      allowance.startDate = formatDate(allowance.startDate);
      allowance.endDate = (allowance.endDate)? formatDate(allowance.endDate) : allowance.endDate;
      console.log(allowance);
      return h.view("edit-allowance-view", { title: "Editing", allowance: allowance });
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
      const updatedAllowance = request.payload;
      updatedAllowance.user = request.state.fitlog.id;
      const updateAllowance = await db.allowanceStore.updateAllowance(request.params.id, updatedAllowance);
      if (updateAllowance.message) {
        const errorDetails = [{ message: updateAllowance.message }];
        return h.view("edit-allowance-view", { title: "Error Updating Food", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },
}