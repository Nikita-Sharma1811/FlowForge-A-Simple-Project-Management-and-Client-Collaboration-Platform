import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#3b82f6' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Label', labelSchema);
