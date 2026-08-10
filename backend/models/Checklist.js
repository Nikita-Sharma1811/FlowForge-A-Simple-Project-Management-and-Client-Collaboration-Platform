import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const checklistSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    items: [checklistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Checklist', checklistSchema);
