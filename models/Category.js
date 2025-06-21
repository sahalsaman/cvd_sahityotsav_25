// models/Category.ts
import mongoose, { Schema } from 'mongoose';

// Schema for a single competition
const CompetitionSchema = new Schema(
  {
    name: { type: String, required: true },
    resultAdded: { type: Boolean, default: false},
  },
  { _id: false }
);

// Schema for category
const CategorySchema = new Schema(
  {
    userId: { type: String, require:true  },
    category: { type: String, required: true },
    competitions: [CompetitionSchema],
  },
  {
    timestamps: true, 
  }
);


  const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default CategoryModel;