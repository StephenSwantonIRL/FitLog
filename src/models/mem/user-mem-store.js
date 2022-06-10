/* eslint-disable no-else-return */
import { v4 } from "uuid";

export const userMemStore = {
  users: [],
  async getAllUsers() {
    return this.users;
  },

  async addUser(user) {
    const userInDb = await this.getUserByEmail(user.email);
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return new Error("Incomplete User Information");
    } else if (userInDb === null) {
      user._id = v4();
      this.users.push(user);
      return user;
    } else {
      // eslint-disable-next-line no-throw-literal
      return new Error("User Already Exists");
    }
  },

  async updateUser(userId, updatedUser) {
    const user = await this.getUserById(userId);
    if (user !== undefined) {
      user.firstName = updatedUser.firstName;
      user.lastName = updatedUser.lastName;
      if (user.email !== updatedUser.email) {
        const updatedEmailInDb = await this.getUserByEmail(updatedUser.email);
        if (updatedEmailInDb === undefined) {
          user.email = updatedUser.email;
        } else {
          return Promise.reject(Error("Another user is already using that email address"));
        }
      }
      user.password = updatedUser.password;
      this.users.push(user);
      return user;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async getUserById(id) {
    let returnedUser = this.users.find((user) => user._id === id);
    if (returnedUser === undefined) {
      returnedUser = null;
    }
    return returnedUser;
  },

  async getUserByEmail(email) {
    let returnedUser = this.users.find((user) => user.email === email);
    if (returnedUser === undefined) {
      returnedUser = null;
    }
    return returnedUser;
  },

  async deleteUserById(id) {
    const userInDb = await this.getUserById(id);
    if (userInDb !== undefined) {
      const index = this.users.findIndex((user) => user._id === id);
      this.users.splice(index, 1);
    }
  },

  async deleteAll() {
    this.users = [];
    return this.users;
  },

  async checkAdmin(id) {
    const u = this.users.find((user) => user._id === id);
    if (u !== undefined) return u.isAdmin;
    return null;
  },

  async makeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      user.isAdmin = true;
      return user.isAdmin;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async revokeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      user.isAdmin = false;
      return user.isAdmin;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },
};
