import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Archived'],
      default: 'Active',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    deadline: { type: Date },
    customStatuses: {
      type: [String],
      default: ['Backlog', 'Todo', 'In Progress', 'Review', 'Testing', 'Done'],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
