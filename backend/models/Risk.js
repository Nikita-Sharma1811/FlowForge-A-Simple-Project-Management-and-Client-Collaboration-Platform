import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    probability: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    impact: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Open', 'Mitigated', 'Closed'],
      default: 'Open',
    },
    mitigationPlan: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Risk', riskSchema);
