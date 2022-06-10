import { v4 } from "uuid";
import _ from "lodash"


export const placeMemStore = {
  places: [],
  getAllPlaces() {
    return _.clone(this.places);
  },

  getUserPlaces(userId) {
    const userPlaces = this.places.filter((place) => place.createdBy === userId);
    return userPlaces
  },

  getOtherUserPlaces(userId) {
    const userPlaces = this.places.filter((place) => place.createdBy !== userId);
    return userPlaces
  },
  async addPlace(place) {
    if (!place.name || !place.location || !place.latitude || !place.longitude || !place.createdBy) {
      return new Error("Incomplete Place Information");
    } else {
      const newPlace = {};
      newPlace._id = v4();
      newPlace.name = place.name;
      newPlace.location = place.location;
      newPlace.latitude = place.latitude;
      newPlace.longitude = place.longitude;
      newPlace.description = place.description;
      newPlace.images = place.images;
      newPlace.createdBy = place.createdBy;
      this.places.push(newPlace);
      return newPlace;
    }
  },

  async getPlaceById(id) {
    let returnedPlace = this.places.find((place) => place._id === id);
    if (returnedPlace === undefined) {
      returnedPlace = null;
    }
    return returnedPlace;



  },

  async updatePlace(id, updatedPlace) {
    const place = await this.getPlaceById(id);
    place.name = updatedPlace.name;
    place.location = updatedPlace.location;
    place.latitude = updatedPlace.latitude;
    place.longitude = updatedPlace.longitude;
    place.description = updatedPlace.description;
    place.images = updatedPlace.images;
  },


  async deletePlaceById(id, createdBy) {
    const placeInDb = await this.getPlaceById(id);
    if (placeInDb !== null) {
      const placeCreatedBy = placeInDb.createdBy;
      if (placeCreatedBy === createdBy) {
        const index = this.places.findIndex((place) => place._id === id);
        this.places.splice(index, 1);
      }
    } else {
      return new Error("No Placemark with that Id");
    }

  },

  async deleteAll() {
    this.places = [];
  },
};

