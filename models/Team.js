import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
  userId: { type: String },
  team: { type: String },
  point: { type: Number, default: 0 },
  totalResult: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const TeamModel = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default TeamModel;
