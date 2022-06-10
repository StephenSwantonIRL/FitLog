/* eslint-disable no-else-return,no-shadow,import/no-duplicates */
import { collection, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, where, addDoc, getDocs, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { placeFireStore} from "./place-fire-store.js";
import { firebaseConfig } from "./firebaseConfig.js";
import { convertResult, addId } from "./firebase-utils.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const categoryCollection = collection(db, "categories");


export const categoryFireStore = {
  async getAllCategories() {
    const snapshot = await getDocs(categoryCollection);
    return convertResult(snapshot);
  },

  async addCategory(category) {
    if (!category.name) {
      return new Error("Incomplete Category Information");
    } else {
      try {
        category.places = [];
        const docRef = await addDoc(categoryCollection, category);
        const returnedDoc = await getDoc(docRef);
        const newCategory = returnedDoc.data();
        newCategory._id = returnedDoc.id;
        return newCategory;
      } catch (e) {
        return new Error("Unable to Create Place");
      }
    }
  },

  async addPlace(placeId, categoryId){
    if (!placeId || ! categoryId) return new Error("Incomplete Information provided");
    const category = await this.getCategoryById(categoryId);
    const place = await placeFireStore.getPlaceById(placeId);
    if (category === null || place === null){
      return new Error("Unable to find Category or Place");
    }
    await updateDoc(doc(db, "categories", categoryId), { places: arrayUnion(placeId)})
    const updatedCategory = await this.getCategoryById(categoryId);
    return updatedCategory;
  },

  async deletePlace(placeId, categoryId){
    if (!placeId || ! categoryId) return new Error("Incomplete Information provided");
    const category = await this.getCategoryById(categoryId);
    if (category === null){
      return new Error("Unable to find Category")
    }
    await updateDoc(doc(db, "categories", categoryId), { places: arrayRemove(placeId)})
    const updatedCategory = await this.getCategoryById(categoryId);
    return updatedCategory;
  },

  async getPlaces(categoryId){
    const category = await this.getCategoryById(categoryId);
    const places = [];
    for (let i = 0; i < category.places.length; i += 1){
      // eslint-disable-next-line no-await-in-loop
      const returnedPlace = await placeFireStore.getPlaceById(category.places[i]);
      places.push(returnedPlace);
    }
    return places;
  },

  async updateCategory(id, updatedCategory) {
    const category = await this.getCategoryById(id);
    if (category) {
      await updateDoc(doc(db, "categories", id), updatedCategory);
      const result = await this.getCategoryById(id);
      return result;
    } else {
      return Promise.reject(Error("Category does not exist"));
    }
  },

  async getCategoryById(id) {
    if (id === undefined) return null;
    const docRef = doc(db, "categories", id);
    try {
      const doc = await getDoc(docRef);
      if (doc.data() === undefined) return null;
      return addId(doc);
    } catch (e) {
      return new Error(e);
    }
  },

  async getCategoryByName(name) {
    const result = await getDocs(query(categoryCollection, where("name", "==", name)));
    const resultsArray = convertResult(result);
    return resultsArray[0];
  },

  async getCategoriesByPlace(placeId) {
    const result = await getDocs(query(categoryCollection, where("places", "array-contains", placeId)));
    return convertResult(result);
  },


  async deleteCategoryById(id, isAdmin) {
    if (id === undefined ) return new Error("missing Parameter");
    const categoryInDb = await this.getCategoryById(id)
    if (categoryInDb !== null && isAdmin === true) {
        const result = await deleteDoc(doc(db, "categories", id));
        return Promise.resolve();
      } else {
        return new Error("Not authorised to delete this category");
      }
    },

  async deleteAll() {
    const allCategories = await this.getAllCategories();
    for (let i = 0; i < allCategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.deleteCategoryById(allCategories[i]._id, true);
    }
  },
};
