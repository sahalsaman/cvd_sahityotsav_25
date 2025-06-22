import mongoose, { Schema } from 'mongoose';

const ResultSchema = new Schema(
  {
    userId: { type: String, required: true },
    
    categoryId: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    competitionId: { type: String, required: true },
    competition: { type: Schema.Types.ObjectId, ref: "Competition", required: true },

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

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ResultModel = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export default ResultModel;
