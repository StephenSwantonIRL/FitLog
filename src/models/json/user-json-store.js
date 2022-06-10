import { v4 } from "uuid";
import { fileURLToPath } from "url"
import { join, dirname } from "path"
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "users.json")
const db = new Low(new JSONFile(file));
db.data = { users: [] }

export const userJsonStore = {
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },

  async addUser(user) {
    await db.read();
    const userInDb = await this.getUserByEmail(user.email);
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return new Error("Incomplete User Information");
    } else if (userInDb === null) {
      user._id = v4();
      user.isAdmin = false;
      db.data.users.push(user);
      await db.write();
      return user;
    } else {
      // eslint-disable-next-line no-throw-literal
      return new Error("User Already Exists");
    }
  },

  async getUserById(id) {
    await db.read();
    let u = db.data.users.find((user) => user._id === id);
    if (u === undefined) u = null;
    return u;
  },

  async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email);
    if (u === undefined)
      u = null;
    return u;
  },

  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) db.data.users.splice(index, 1);
    await db.write();
  },

  async deleteAll() {
    db.data.users = [];
    await db.write();
  },

  async updateUser(userId, updatedUser) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      user.firstName = updatedUser.firstName;
      user.lastName = updatedUser.lastName;
      if (user.email !== updatedUser.email) {
        const updatedEmailInDb = await this.getUserByEmail(updatedUser.email);
        if (updatedEmailInDb === null) {
          user.email = updatedUser.email;
        } else {
          return Promise.reject(Error("Another user is already using that email address"));
        }
      }
      user.password = updatedUser.password;
      db.data.users.push(user);
      await db.write();
      return user;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async checkAdmin(id) {
    await db.read();
    const u = db.data.users.find((user) => user._id === id);
    console.log(u)
    if (u !== undefined) return u.isAdmin;
    return null;
  },

  async makeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      user.isAdmin = true;
      await db.write();
      return user.isAdmin;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async revokeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      user.isAdmin = false;
      await db.write();
      return user.isAdmin;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },
};

