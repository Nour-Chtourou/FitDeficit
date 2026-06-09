const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
  },
  goal: { type: String, enum: ['lose', 'maintain', 'gain'] },
  tdee: { type: Number },
  targetCalories: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);