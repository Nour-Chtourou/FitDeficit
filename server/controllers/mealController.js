const Meal = require('../models/Meal');

// Ajouter un repas
exports.addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, quantity, unit, mealType } = req.body;

    const meal = await Meal.create({
      user: req.user.id,
      name, calories, protein, carbs, fat, quantity, unit, mealType
    });

    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Récupérer les repas du jour
exports.getTodayMeals = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    // Calculer les totaux
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    res.json({ meals, totals });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Supprimer un repas
exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Repas supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};