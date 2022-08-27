import { Weight } from "./weight.js";

export const weightMongoStore = {
  async getAllWeights() {
    const weights = await Weight.find().lean();
    return weights;
  },

  async getWeightById(id) {
    if (id) {
      const weight = await Weight.findOne({ _id: id }).lean();
      return weight;
    }
    return null;
  },

  async addWeight(weight) {

    const operation = new Weight(weight);
    const returnedWeight = await operation.save();
    return this.getWeightById(returnedWeight._id);
  },

  async updateWeight(id, updatedWeight) {
    await Weight.updateOne(
      { _id: id },
      {
        date: updatedWeight.date,
        weight: updatedWeight.weight,
        user: updatedWeight.user,
      }
    );
    const amendedWeight = await this.getWeightById(id);
    return amendedWeight;
  },

  async getUserWeights(id) {
    const weights = await Weight.find({ user: id }).lean();
    return weights;
  },


  async deleteWeightById(id, createdBy) {
    const weightInDb = await this.getWeightById(id);
    if (weightInDb === null) {
      return new Error("No Weight Record with that Id");
    }
    const recordCreatedBy = foodInDb.user;
    if (JSON.stringify(recordCreatedBy) == JSON.stringify(createdBy)) {
      try {
        await Weight.deleteOne({ _id: id });
        return Promise.resolve();
      } catch (error) {
        return new Error("No Record with that Id");
      }
    } else {
      return new Error("User not authorised to delete this record");
    }
  },

  async deleteAll() {
    await Weight.deleteMany({});
  },

}
