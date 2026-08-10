import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    description: { type: String, default: '' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    isRunning: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('TimeEntry', timeEntrySchema);
