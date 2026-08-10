import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    goal: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Completed'],
      default: 'Planning',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Sprint', sprintSchema);
