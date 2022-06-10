/* eslint-disable no-else-return,no-shadow,import/no-duplicates */
import { collection, doc, deleteDoc, updateDoc, query, where, addDoc, getDocs, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";
import { convertResult, addId } from "./firebase-utils.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const placeCollection = collection(db, "places");

export const placeFireStore = {
  async getAllPlaces() {
    const snapshot = await getDocs(placeCollection);
    return convertResult(snapshot);
  },

  async addPlace(place) {
    if (!place.name || !place.location || !place.latitude || !place.longitude || !place.createdBy) {
      return new Error("Incomplete Place Information");
    } else {
      try {
        const docRef = await addDoc(placeCollection, place);
        const returnedDoc = await getDoc(docRef);
        const newPlace = returnedDoc.data();
        newPlace._id = returnedDoc.id;
        return newPlace;
      } catch (e) {
        return new Error("Unable to Create Place");
      }
    }
  },

  async updatePlace(id, updatedPlace) {
    const place = await this.getPlaceById(id);
    if (place) {
      await updateDoc(doc(db, "places", id), updatedPlace);
      const result = await this.getPlaceById(id);
      return result;
    } else {
      return Promise.reject(Error("Place does not exist"));
    }
  },

  async getPlaceById(id) {
    if (id === undefined) return null;
    const docRef = doc(db, "places", id);
    try {
      const doc = await getDoc(docRef);
      if (doc.data() === undefined) return null;
      return addId(doc);
    } catch (e) {
      return new Error(e);
    }
  },

  async getUserPlaces(userId) {
    const result = await getDocs(query(placeCollection, where("createdBy", "==", userId)));
    return convertResult(result);
  },

  async getOtherUserPlaces(userId) {
    const result = await getDocs(query(placeCollection, where("createdBy", "!=", userId)));
    return convertResult(result);
  },

  async deletePlaceById(id, createdBy) {
    if (id === undefined || createdBy === undefined || createdBy === null) return new Error("missing Parameter");
    const placeInDb = await this.getPlaceById(id);
    if (placeInDb !== null) {
      const placeCreatedBy = placeInDb.createdBy;
      if (placeCreatedBy === createdBy) {
        const result = await deleteDoc(doc(db, "places", id));
        return Promise.resolve();
      } else {
        return new Error("Not authorised to delete this placeMark");
      }
    } else {
      return new Error("No Placemark with that Id");
    }
  },

  async deleteAll() {
    const allPlaces = await this.getAllPlaces();
    for (let i = 0; i < allPlaces.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.deletePlaceById(allPlaces[i]._id, allPlaces[i].createdBy);
    }
  },
};
