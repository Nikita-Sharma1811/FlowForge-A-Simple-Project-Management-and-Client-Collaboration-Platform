import mongoose from 'mongoose';

const standupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    yesterday: { type: String, required: true },
    today: { type: String, required: true },
    blockers: { type: String, default: '' },
    date: { type: String, required: true }, // e.g. "2026-08-10"
  },
  { timestamps: true }
);

export default mongoose.model('Standup', standupSchema);
