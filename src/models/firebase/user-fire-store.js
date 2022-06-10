/* eslint-disable no-else-return,no-shadow,import/no-duplicates */
import { collection, doc, deleteDoc, updateDoc, query, where, addDoc, getDocs, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";
import { convertResult, addId } from "./firebase-utils.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const userCollection = collection(db, "users");

export const userFireStore = {
  users: [],
  async getAllUsers() {
    const snapshot = await getDocs(userCollection);
    return convertResult(snapshot);
  },

  async addUser(user) {
    const userInDb = await this.getUserByEmail(user.email);
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return new Error("Incomplete User Information");
    } else if (userInDb === null) {
      user.isAdmin = false;
      try {
        const docRef = await addDoc(userCollection, user);
        const c = await getDoc(docRef);
        const newUser = c.data();
        newUser._id = c.id;
        return newUser;
      } catch (e) {
        return new Error("Unable to Create User");
      }
    } else {
      // eslint-disable-next-line no-throw-literal
      return new Error("User Already Exists");
    }
  },

  async updateUser(userId, updatedUser) {
    const user = await this.getUserById(userId);
    if (user) {
      if (user.email !== updatedUser.email) {
        const updatedEmailInDb = await this.getUserByEmail(updatedUser.email);
        if (updatedEmailInDb === undefined) {
          user.email = updatedUser.email;
        } else {
          return Promise.reject(Error("Another user is already using that email address"));
        }
      }

      await updateDoc(doc(db, "users", userId), updatedUser);

      const result = await this.getUserById(userId);
      return result;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async getUserById(id) {
    if (id === undefined) return null;
    const docRef = doc(db, "users", id);
    try {
      const doc = await getDoc(docRef);
      if (doc.data() === undefined) return null;
      return addId(doc);
    } catch (e) {
      return new Error(e);
    }
  },

  async getUserByEmail(email) {
    const results = await getDocs(query(collection(db, "users"), where("email", "==", email)));
    const resultsArray = convertResult(results);
    if (resultsArray[0] === undefined) return null;
    return resultsArray[0];
  },

  async deleteUserById(id) {
    const result = await deleteDoc(doc(db, "users", id));
  },

  async deleteAll() {
    const allUsers = await this.getAllUsers();
    for (let i = 0; i < allUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.deleteUserById(allUsers[i]._id);
    }
  },

  async checkAdmin(id) {
    const docRef = doc(db, "users", id);
    try {
      const doc = await getDoc(docRef);
      return doc.data().isAdmin;
    } catch (e) {
      return new Error(e);
    }
  },

  async makeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      await updateDoc(doc(db, "users", userId), { isAdmin: true });

      return true;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },

  async revokeAdmin(userId) {
    const user = await this.getUserById(userId);
    if (user !== null) {
      await updateDoc(doc(db, "users", userId), { isAdmin: false });
      return false;
    } else {
      return Promise.reject(Error("User does not exist"));
    }
  },
};
