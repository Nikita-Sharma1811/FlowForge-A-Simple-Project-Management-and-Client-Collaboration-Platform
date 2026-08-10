import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Project Manager', 'Team Member', 'Client'],
      default: 'Team Member',
    },
    avatar: { type: String, default: '' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    status: { type: String, enum: ['online', 'offline'], default: 'offline' },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Password encryption before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
