import { Allowance } from "./allowance.js";

export const allowanceMongoStore = {
  async getAllAllowances() {
    const allowances = await Allowance.find().lean();
    return allowances;
  },

  async getAllowanceById(id) {
    if (id) {
      const allowance = await Allowance.findOne({ _id: id }).lean();
      return allowance;
    }
    return null;
  },

  async addAllowance(allowance) {
    const operation = new Allowance(allowance);
    const returnedAllowance = await operation.save();
    return this.getAllowanceById(returnedAllowance._id);
  },

  async updateAllowance(id, updatedAllowance) {
    await Allowance.updateOne(
      { _id: id },
      {
        startDate: updatedAllowance.startDate,
        endDate: updatedAllowance.endDate,
        protein: updatedAllowance.protein,
        carbs: updatedAllowance.carbs,
        fat: updatedAllowance.fat,
        veggie:  updatedAllowance.veggie,
        user: updatedAllowance.user,
      }
    );
    const amendedAllowance = await this.getAllowanceById(id);
    return amendedAllowance;
  },

  async getUserAllowances(id) {
    const allowances = await Allowance.find({ user: id }).lean();
    return allowances;
  },

  async getActiveAllowance(id){
    const allowances = await Allowance.find({startDate: { $gte: new Date()}}).lean();
    return allowances;
  },


  async deleteAllowanceById(id, userId) {
    const allowanceInDb = await this.getAllowanceById(id);
    if (allowanceInDb === null) {
      return new Error("No Allowance with that Id");
    }
    const allowanceUser = allowanceInDb.user;
    if (JSON.stringify(allowanceUser) == JSON.stringify(userId)) {
      try {
        await Allowance.deleteOne({ _id: id });
        return Promise.resolve();
      } catch (error) {
        return new Error("No Allowance with that Id");
      }
    } else {
      return new Error("User not authorised to delete this Allowance");
    }
  },

  async deleteAll() {
    await Allowance.deleteMany({});
  },

}
