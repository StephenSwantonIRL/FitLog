import { userMemStore } from "./mem/user-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { userMongoStore} from "./mongo/user-mongo-store.js";
import { userFireStore } from "./firebase/user-fire-store.js"
import { placeJsonStore } from "./json/place-json-store.js";
import { placeMemStore } from "./mem/place-mem-store.js";
import { placeMongoStore } from "./mongo/place-mongo-store.js";
import { placeFireStore} from "./firebase/place-fire-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js";
import { categoryJsonStore } from "./json/category-json-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { categoryFireStore} from "./firebase/category-fire-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  placeStore: null,
  categoryStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.placeStore = placeJsonStore;
        this.categoryStore = categoryJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.placeStore = placeMongoStore;
        this.categoryStore = categoryMongoStore;
        connectMongo();
        break;
      case "fire" :
        this.userStore = userFireStore;
        this.placeStore = placeFireStore;
        this.categoryStore = categoryFireStore;
        break;
      default :
        this.userStore = userMemStore;
        this.placeStore = placeMemStore;
        this.categoryStore = categoryMemStore;
    }
  }
};
