import { userMongoStore} from "./mongo/user-mongo-store.js";
import { foodMongoStore } from "./mongo/food-mongo-store.js";
import { logMongoStore } from "./mongo/log-mongo-store.js";
import { allowanceMongoStore } from "./mongo/allowance-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  foodStore: null,
  logStore: null,
  allowanceStore: null,

  init(storeType) {
    switch (storeType) {
      case "mongo" :
        this.userStore = userMongoStore;
        this.foodStore = foodMongoStore;
        this.logStore = logMongoStore;
        this.allowanceStore = allowanceMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMongoStore;
        this.foodStore = foodMongoStore;
        this.logStore = logMongoStore;
        this.allowanceStore = allowanceMongoStore;
    }
  }
};
