import { v4 } from "uuid";
import { fileURLToPath } from "url"
import { join, dirname } from "path"
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'places.json')
const db = new Low(new JSONFile(file));
db.data = { places: [] }


export const placeJsonStore = {
  async getAllPlaces() {
    await db.read();
    return db.data.places;

  },

  async addPlace(place) {
    await db.read();
    const newPlace = {};
    newPlace.name = place.name;
    newPlace.location = place.location;
    newPlace.latitude = place.latitude;
    newPlace.longitude = place.longitude;
    newPlace.description = place.description;
    newPlace.images = place.images;
    newPlace.createdBy = place.createdBy;
    newPlace._id = v4();
    db.data.places.push(newPlace);
    await db.write();
    return newPlace;
  },

  async getPlaceById(id) {
    await db.read();
    let p = db.data.places.find((place) => place._id === id);
    if (p === undefined) p = null;
    return p;
  },

  async getUserPlaces(userid) {
    await db.read();
    return db.data.places.filter((place) => place.createdBy === userid);
  },

  async getOtherUserPlaces(userId) {
    await db.read();
    const userPlaces = db.data.places.filter((place) => place.createdBy !== userId);
    return userPlaces;
  },

  async deletePlaceById(id, createdBy) {
    const placeInDb = await this.getPlaceById(id);
    if (placeInDb !== null) {
      await db.read();
      const placeCreatedBy = placeInDb.createdBy;
      if (placeCreatedBy === createdBy) {
        const index = db.data.places.findIndex((places) => places._id === id);
        if (index !== -1) db.data.places.splice(index, 1);
        await db.write();
        return Promise.resolve()
      }
    } else {
      return new Error("No Placemark with that Id");
    }

  },

  async updatePlace(id, updatedPlace) {
    await db.read();
    const place = await this.getPlaceById(id);
    place.name = updatedPlace.name;
    place.location = updatedPlace.location;
    place.latitude = updatedPlace.latitude;
    place.longitude = updatedPlace.longitude;
    place.description = updatedPlace.description;
    place.images = updatedPlace.images;
    await db.write();
  },

  async deleteAll() {
    db.data.places = [];
    await db.write();
  },
};
