import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true, 
  }
);

const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default CategoryModel;
