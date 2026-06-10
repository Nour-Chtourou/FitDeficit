import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';

const API_URL = 'http://localhost:5001/api';

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  quantity: number;
}

const Dashboard = () => {
  const { user, logoutUser, token } = useAuth();
  const navigate = useNavigate();
  const [totals, setTotals] = useState<Totals>({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.tdee) {
      navigate('/setup');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTodayMeals = async () => {
      try {
        const response = await axios.get(`${API_URL}/meals/today`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotals(response.data.totals);
        setMeals(response.data.meals);
      } catch (err) {
        console.error('Erreur chargement repas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTodayMeals();
  }, [token]);

  const deleteMeal = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(meals.filter(m => m._id !== id));
      const response = await axios.get(`${API_URL}/meals/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTotals(response.data.totals);
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const targets = {
    calories: user?.targetCalories || 2000,
    protein: Math.round(((user?.targetCalories || 2000) * 0.30) / 4),
    carbs: Math.round(((user?.targetCalories || 2000) * 0.45) / 4),
    fat: Math.round(((user?.targetCalories || 2000) * 0.25) / 9),
  };

  const goalLabel: Record<string, string> = {
    lose: '🔥 Perte de poids',
    maintain: '⚖️ Maintien',
    gain: '💪 Prise de masse'
  };

  const mealTypeLabel: Record<string, string> = {
    breakfast: '🌅 Petit-déjeuner',
    lunch: '☀️ Déjeuner',
    dinner: '🌙 Dîner',
    snack: '🍎 Collation'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-green-400">🏋️ FitDeficit</h1>
          <p className="text-gray-500 text-sm">{goalLabel[user?.goal || 'maintain']}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Bonjour, {user?.name} 👋</span>
          <button
            onClick={logoutUser}
            className="text-gray-500 hover:text-red-400 text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Calorie Ring */}
        <div className="bg-gray-900 rounded-2xl p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold text-white mb-4">Calories du jour</h2>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : (
            <CalorieRing consumed={totals.calories} target={targets.calories} />
          )}
        </div>

        {/* Macros */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Macronutriments</h2>
          <MacroBar label="🥩 Protéines" consumed={totals.protein} target={targets.protein} color="#4ade80" unit="g" />
          <MacroBar label="🍞 Glucides" consumed={totals.carbs} target={targets.carbs} color="#60a5fa" unit="g" />
          <MacroBar label="🥑 Lipides" consumed={totals.fat} target={targets.fat} color="#f59e0b" unit="g" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{user?.tdee}</p>
            <p className="text-gray-500 text-xs mt-1">TDEE kcal</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{targets.calories}</p>
            <p className="text-gray-500 text-xs mt-1">Objectif kcal</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{user?.weight}kg</p>
            <p className="text-gray-500 text-xs mt-1">Poids actuel</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/log-meal')}
            className="bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl transition-colors text-lg"
          >
            🍽️ Logger un repas
          </button>
          <button
            onClick={() => navigate('/log-workout')}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
          >
            💪 Logger une séance
          </button>
        </div>

        {/* Liste des repas du jour */}
        {meals.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-white">Repas d'aujourd'hui</h2>
            {meals.map(meal => (
              <div key={meal._id} className="flex justify-between items-center bg-gray-800 rounded-xl p-4">
                <div>
                  <p className="text-white font-medium truncate max-w-xs">{meal.name}</p>
                  <p className="text-gray-500 text-sm">
                    {mealTypeLabel[meal.mealType]} · {meal.quantity}g · {meal.calories} kcal
                  </p>
                </div>
                <button
                  onClick={() => deleteMeal(meal._id)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-4"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;