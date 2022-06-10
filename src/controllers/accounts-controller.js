import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Playlist" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Playlist" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      const addUser = await db.userStore.addUser(user);
      if (addUser.message) {
        const errorDetails = [{ message: addUser.message }];
        return h.view("signup-view", { title: "Sign up error", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Playlist" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(`Validation Error${error.details}`);
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      console.log(email);
      const user = await db.userStore.getUserByEmail(email);
      console.log(user);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },


  edit: {
    handler: async function (request, h) {
      const currentUserId = request.state.placemark.id;
      if (!currentUserId){
        return h.redirect("/");
      }
        const currentUser = await db.userStore.getUserById(currentUserId);
        console.log(currentUser)
        return h.view("edit-user-view", { title: "Edit your details", user: currentUser });


    },
  },
  update: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: true },
      failAction: function (request, h, error) {
        return h.view("edit-user-view", { title: "Error Editing Details", errors: error.details, user: request.payload }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const updatedUser = request.payload;
      const userId = request.state.placemark.id;
      const updateUser = await db.userStore.updateUser(userId, updatedUser);
      if (updateUser.message) {
        const errorDetails = [{ message: updateUser.message }];
        return h.view("edit-user-view", { title: "Failed to Edit", errors: errorDetails }).takeover().code(400);
      }
      return h.redirect("/dashboard");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: user };
  },
};
