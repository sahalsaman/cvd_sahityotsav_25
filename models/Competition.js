import mongoose, { Schema } from 'mongoose';

const CompetitionSchema = new Schema(
  {
    userId: { type: String, required: true },
    categoryId: { type: String, required: true }, // Redundant, but OK for quick filtering
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    name: { type: String, required: true },
    resultAdded: { type: Boolean, default: false },
    result: { type: Schema.Types.ObjectId, ref: "Result" }, // optional ref
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CompetitionModel = mongoose.models.Competition || mongoose.model("Competition", CompetitionSchema);
export default CompetitionModel;
