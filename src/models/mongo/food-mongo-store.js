import { Food } from "./food.js";

export const foodMongoStore = {
  async getAllFoods() {
    const foods = await Food.find().lean();
    return foods;
  },

  async getFoodById(id) {
    if (id) {
      const food = await Food.findOne({ _id: id }).lean();
      return food;
    }
    return null;
  },

  async addFood(food) {

    const operation = new Food(food);
    const returnedFood = await operation.save();
    return this.getFoodById(returnedFood._id);
  },

  async updateFood(id, updatedFood) {
    await Food.updateOne(
      { _id: id },
      {
        name: updatedFood.name,
        amount: updatedFood.amount,
        protein: updatedFood.protein,
        carbs: updatedFood.carbs,
        fat: updatedFood.fat,
        veggie: updatedFood.veggies,
        createdBy: updatedFood.createdBy,
      }
    );
    const amendedFood = await this.getFoodById(id);
    return amendedFood;
  },

  async getUserFoods(id) {
    const foods = await Food.find({ createdBy: id }).lean();
    return foods;
  },


  async deleteFoodById(id, createdBy) {
    const foodInDb = await this.getFoodById(id);
    if (foodInDb === null) {
      return new Error("No Food with that Id");
    }
    const foodCreatedBy = foodInDb.createdBy;
    if (JSON.stringify(foodCreatedBy) == JSON.stringify(createdBy)) {
      try {
        await Food.deleteOne({ _id: id });
        return Promise.resolve();
      } catch (error) {
        return new Error("No Placemark with that Id");
      }
    } else {
      return new Error("User not authorised to delete this Placemark");
    }
  },

  async deleteAll() {
    await Food.deleteMany({});
  },

}
