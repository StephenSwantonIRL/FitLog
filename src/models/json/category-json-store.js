/* eslint-disable no-else-return */
import { v4 } from "uuid";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";
import _ from "lodash";
import { placeJsonStore } from "./place-json-store.js";
import { svalbard } from "../../../test/fixtures.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "categories.json");
const db = new Low(new JSONFile(file));
db.data = { categories: [] };

export const categoryJsonStore = {
  async getAllCategories() {
    await db.read();
    return db.data.categories;
  },

  async addCategory(category) {
    await db.read();
    if (!category.name) {
      return new Error("Incomplete Category Information");
    } else {
      category._id = v4();
      category.places = [];
      db.data.categories.push(category);
      await db.write();
      return category;
    }
  },

  async addPlace(placeId, categoryId) {
    await db.read();
    if (!placeId || !categoryId) {
      return new Error("Incomplete information provided");
    } else {
      const category = await this.getCategoryById(categoryId);
      const place = await placeJsonStore.getPlaceById(placeId);
      if (category === null || place === null) {
        return new Error("Unable to find Category or Place");
      } else {
        category.places.push(placeId);
        await db.write();
        return category;
      }
    }
  },

  async deletePlace(placeId, categoryId) {
    if (!placeId || !categoryId) {
      return new Error("Incomplete information provided");
    } else {
      await db.read();
      const category = await this.getCategoryById(categoryId);
      if (category === null) {
        return new Error("Unable to find Category");
      } else {
        const index = category.places.findIndex((place) => place === placeId);
        category.places.splice(index, 1);
        db.write();
        return category;
      }
    }
  },

  async getPlaces(categoryId) {
    await db.read();
    const category = await this.getCategoryById(categoryId);
    const places = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < category.places.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const returnedPlace = await placeJsonStore.getPlaceById(category.places[i]);
      places.push(returnedPlace);
    }
    return places;
  },

  async getCategoryById(id) {
    await db.read();
    let returnedCategory = db.data.categories.find((category) => category._id === id);
    if (returnedCategory === undefined) {
      returnedCategory = null;
    }
    return returnedCategory;
  },

  async getCategoryByName(name) {
    await db.read();
    let returnedCategory = db.data.categories.find((category) => category.name === name);
    if (returnedCategory === undefined) {
      returnedCategory = null;
    }
    return returnedCategory;
  },

  async getCategoriesByPlace(placeId) {
    await db.read();
    const returnedCategories = db.data.categories.filter((category) => category.places.includes(placeId));
    const clone = _.cloneDeep(returnedCategories);
    for (let i = 0; i < clone.length; i += 1) {
      delete clone[i].places;
    }
    return clone;
  },

  async deleteCategoryById(id, isAdmin) {
    const categoryInDb = await this.getCategoryById(id);
    if (categoryInDb !== null && isAdmin === true) {
      await db.read();
      const index = db.data.categories.findIndex((category) => category._id === id);
      if (index !== -1) db.data.categories.splice(index, 1);
      await db.write();
      return Promise.resolve();
    } else {
      return new Error("Unable to complete request. Please ensure valid Category Id and Administrator");
    }
  },

  async updateCategory(id, updatedCategory) {
    await db.read();
    const category = await this.getCategoryById(id);
    category.name = updatedCategory.name;
    await db.write();
    return category;
  },

  async deleteAll() {
    db.data.categories = [];
    await db.write();
  },
};
