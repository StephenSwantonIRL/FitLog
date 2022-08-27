import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { foodController } from "./controllers/food-controller.js";
import { allowanceController } from "./controllers/allowance-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";


export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "POST", path: "/updateUser", config: accountsController.update },
  { method: "GET", path: "/editAccount", config: accountsController.edit },

  { method: "GET", path: "/addFood", config:  foodController.add },
  { method: "POST", path: "/addFood", config: foodController.save },
  { method: "GET", path: "/editFood/{id}", config: foodController.edit },
  { method: "POST", path: "/editFood/{id}", config: foodController.saveEdited },

  { method: "GET", path: "/addDiet", config:  allowanceController.add },
  { method: "POST", path: "/addDiet", config: allowanceController.save },
  { method: "GET", path: "/editDiet/{id}", config: allowanceController.edit },
  { method: "POST", path: "/editDiet/{id}", config: allowanceController.saveEdited },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/logFood", config:  dashboardController.log },
  { method: "POST", path: "/logFood", config: dashboardController.saveLog},
  { method: "GET", path: "/deleteLog/{logId}/{foodId}", config: dashboardController.deleteLog },
  { method: "GET", path: "/editLog/{logId}/{foodId}", config: dashboardController.editLog },
  { method: "POST", path: "/editLog/{logId}/{foodId}", config: dashboardController.updateLog },
  { method: "POST", path: "/addWeight", config: dashboardController.addWeight },
  { method: "POST", path: "/search", config: foodController.searchFood },



  /*

    { method: "GET", path: "/deletePlace/{id}", config: placeController.delete },

    { method: "GET", path: "/getPlace/{id}", config: placeController.findOne },
    { method: "POST", path: "/place/uploadimage", config: placeController.uploadImage },

    { method: "GET", path: "/about", config: aboutController.index },


    { method: "GET", path: "/admin", config: dashboardController.admin },
    { method: "GET", path: "/makeAdmin/{id}", config: dashboardController.makeAdmin },
    { method: "GET", path: "/revokeAdmin/{id}", config: dashboardController.revokeAdmin },
    { method: "GET", path: "/deleteUser/{id}", config: dashboardController.deleteUser },
    { method: "GET", path: "/category/{id}", config: placeController.viewByCategory },
    { method: "POST", path: "/addCategory", config: dashboardController.addCategory },
    { method: "GET", path: "/deleteCategory/{id}", config: dashboardController.deleteCategory },
    { method: "POST", path: "/editCategory/{id}", config: dashboardController.editCategory },*/
  { method: "GET", path: "/{param*}", handler: { directory: { path: "../public" } }, options: { auth: false } }
];
