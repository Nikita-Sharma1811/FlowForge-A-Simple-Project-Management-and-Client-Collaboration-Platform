import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['Task', 'Bug', 'Story', 'Epic', 'Subtask'],
      default: 'Task',
    },
    status: { type: String, default: 'Todo' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    labels: [{ type: String }],
    deadline: { type: Date },
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
