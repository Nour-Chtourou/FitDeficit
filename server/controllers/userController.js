const User = require('../models/User');

// Calcul BMR (Harris-Benedict)
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// Calcul TDEE
const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  return Math.round(bmr * multipliers[activityLevel]);
};

// Calcul calories cibles selon objectif
const calculateTargetCalories = (tdee, goal) => {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 300;
  return tdee;
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { age, weight, height, gender, activityLevel, goal } = req.body;

    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const targetCalories = calculateTargetCalories(tdee, goal);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { age, weight, height, gender, activityLevel, goal, tdee, targetCalories },
      { returnDocument: 'after' }
    ).select('-password');

    res.json({ user, tdee, targetCalories });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};