import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  per100g: boolean;
}

const mealTypes = [
  { value: 'breakfast', label: '🌅 Petit-déjeuner' },
  { value: 'lunch', label: '☀️ Déjeuner' },
  { value: 'dinner', label: '🌙 Dîner' },
  { value: 'snack', label: '🍎 Collation' },
];

const LogMeal = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodResult[]>([]);
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [mealType, setMealType] = useState('lunch');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Recherche OpenFoodFacts
  const searchFood = async () => {
  if (!query.trim()) return;
  setLoading(true);
  setError('');
  setResults([]);

  try {
    const response = await axios.get(
      `${API_URL}/meals/search`,
      {
        params: { query },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setResults(response.data);
    if (response.data.length === 0) setError('Aucun résultat trouvé. Essaie un autre terme.');
  } catch {
    setError('Erreur lors de la recherche. Vérifie ta connexion.');
  } finally {
    setLoading(false);
  }
};

  // Calculer les valeurs selon la quantité
  const getAdjusted = () => {
    if (!selected) return null;
    const ratio = Number(quantity) / 100;
    return {
      calories: Math.round(selected.calories * ratio),
      protein: Math.round(selected.protein * ratio),
      carbs: Math.round(selected.carbs * ratio),
      fat: Math.round(selected.fat * ratio),
    };
  };

  // Sauvegarder le repas
  const saveMeal = async () => {
    if (!selected || !quantity) return;
    setSaving(true);
    const adjusted = getAdjusted()!;

    try {
      await axios.post(
        `${API_URL}/meals`,
        {
          name: selected.name,
          ...adjusted,
          quantity: Number(quantity),
          unit: 'g',
          mealType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const adjusted = getAdjusted();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold">🍽️ Logger un repas</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Type de repas */}
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setMealType(type.value)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                mealType === type.value
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Rechercher un aliment</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchFood()}
              placeholder="Ex: poulet, riz, banane..."
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            />
            <button
              onClick={searchFood}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? '...' : '🔍'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Résultats */}
          {results.length > 0 && !selected && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((food, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(food)}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition-colors"
                >
                  <p className="font-medium text-white truncate">{food.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {food.calories} kcal · {food.protein}g prot · {food.carbs}g glucides · {food.fat}g lipides
                    <span className="text-gray-600"> /100g</span>
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Aliment sélectionné */}
        {selected && (
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                <p className="text-gray-500 text-sm">Pour 100g</p>
              </div>
              <button
                onClick={() => { setSelected(null); setResults([]); setQuery(''); }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕ Changer
              </button>
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Quantité (g)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Valeurs ajustées */}
            {adjusted && (
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold text-lg">{adjusted.calories}</p>
                  <p className="text-gray-500 text-xs">kcal</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold text-lg">{adjusted.protein}g</p>
                  <p className="text-gray-500 text-xs">prot.</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-blue-400 font-bold text-lg">{adjusted.carbs}g</p>
                  <p className="text-gray-500 text-xs">glucides</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-orange-400 font-bold text-lg">{adjusted.fat}g</p>
                  <p className="text-gray-500 text-xs">lipides</p>
                </div>
              </div>
            )}

            <button
              onClick={saveMeal}
              disabled={saving}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : '✅ Ajouter ce repas'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogMeal;