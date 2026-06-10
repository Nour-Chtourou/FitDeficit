const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { addMeal, getTodayMeals, deleteMeal } = require('../controllers/mealController');
const axios = require('axios');

router.post('/', authMiddleware, addMeal);
router.get('/today', authMiddleware, getTodayMeals);
router.delete('/:id', authMiddleware, deleteMeal);

// Recherche OpenFoodFacts via le backend
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `https://world.openfoodfacts.org/cgi/search.pl`,
      {
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 8,
          fields: 'product_name,nutriments'
        }
      }
    );

    const products = response.data.products || [];
    const filtered = products
      .filter((p) => p.product_name && p.nutriments?.['energy-kcal_100g'])
      .map((p) => ({
        name: p.product_name,
        calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
        protein: Math.round(p.nutriments['proteins_100g'] || 0),
        carbs: Math.round(p.nutriments['carbohydrates_100g'] || 0),
        fat: Math.round(p.nutriments['fat_100g'] || 0),
      }));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: 'Erreur recherche', error: err.message });
  }
});

module.exports = router;