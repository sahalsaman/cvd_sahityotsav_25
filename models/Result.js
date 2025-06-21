// models/Result.ts
import mongoose, { Schema } from 'mongoose';

const ResultSchema = new Schema(
  {
    userId: { type: String },
    category: { type: String, required: true },
    compotition: { type: String, required: true },
    resultNumber: { type: String, required: true },
    f_name: { type: String, required: true },
    f_team: { type: String, required: true },
    s_name: String,
    s_team: String,
    s2_name: String,
    s2_team: String,
    t_name: String,
    t_team: String,
    t2_name: String,
    t2_team: String,
    publish: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ResultModel = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default ResultModel