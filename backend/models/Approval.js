import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    deliverableName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Changes Requested'],
      default: 'Pending',
    },
    feedback: { type: String, default: '' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Approval', approvalSchema);
