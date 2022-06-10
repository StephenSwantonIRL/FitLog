/* eslint-disable no-else-return */
import { v4 } from "uuid";
import _ from "lodash";
import { placeMemStore } from "./place-mem-store.js";

export const categoryMemStore = {
  categories: [],
  getAllCategories() {
    return _.clone(this.categories);
  },

  async addCategory(category) {
    if (!category.name) {
      return new Error("Incomplete Category Information");
    } else {
      category._id = v4();
      category.places = [];
      this.categories.push(category);
      return category;
    }
  },

  async addPlace(placeId, categoryId) {
    if (!placeId || !categoryId) {
      return new Error("Incomplete information provided");
    } else {
      const category = await this.getCategoryById(categoryId);
      const place = await placeMemStore.getPlaceById(placeId);
      if (category === null || place === null) {
        return new Error("Unable to find Category or Place");
      } else {
        category.places.push(placeId);
        return category;
      }
    }
  },

  async deletePlace(placeId, categoryId) {
    if (!placeId || !categoryId) {
      return new Error("Incomplete information provided");
    } else {
      const category = await this.getCategoryById(categoryId);
      if (category === null) {
        return new Error("Unable to find Category");
      } else {
        const index = category.places.findIndex((place) => place === placeId);
        category.places.splice(index, 1);
        return category;
      }
    }
  },

  async getPlaces(categoryId) {
    const category = await this.getCategoryById(categoryId);
    const p = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < category.places.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      let pl = await placeMemStore.getPlaceById(category.places[i]);
      p.push(pl);
    }
    return p;
  },

  async getCategoryById(id) {
    let returnedCategory = this.categories.find((category) => category._id === id);
    if (returnedCategory === undefined) {
      returnedCategory = null;
    }
    return returnedCategory;
  },

  async getCategoryByName(name) {
    let returnedCategory = this.categories.find((category) => category.name === name);
    if (returnedCategory === undefined) {
      returnedCategory = null;
    }
    return returnedCategory;
  },

  async getCategoriesByPlace(placeId) {
    const returnedCategories = this.categories.filter((category) => category.places.includes(placeId));
    const clone = _.cloneDeep(returnedCategories);
    for (let i = 0; i < clone.length; i += 1) {
      delete clone[i].places;
    }
    return clone;
  },

  async updateCategory(id, updatedCategory) {
    let category = await this.getCategoryById(id);
    category.name = updatedCategory.name;
    return category;
  },

  async deleteCategoryById(id, isAdmin) {
    const categoryInDb = await this.getCategoryById(id);
    if (categoryInDb !== null && isAdmin === true) {
      const index = this.categories.findIndex((category) => category._id === id);
      this.categories.splice(index, 1);
      return Promise.resolve();
    } else {
      return new Error("Unable to complete request. Please ensure valid Category Id and Administrator");
    }
  },

  async deleteAll() {
    this.categories = [];
  },
};
