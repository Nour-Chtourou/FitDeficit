import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const SetupProfile = () => {
  const navigate = useNavigate();
  const { token, loginUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        `${API_URL}/user/profile`,
        {
          age: Number(formData.age),
          weight: Number(formData.weight),
          height: Number(formData.height),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goal: formData.goal
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loginUser(token!, response.data.user);
      navigate('/dashboard');
    } catch {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const btnBase = "w-full py-3 px-4 rounded-xl border-2 text-left transition-all duration-200 ";
  const btnSelected = "border-green-400 bg-green-400/10 text-green-400 font-semibold";
  const btnNormal = "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500";

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400">🏋️ FitDeficit</h1>
          <p className="text-gray-400 mt-2">Configure ton profil — Étape {step}/3</p>
          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1 — Infos de base */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Tes informations</h2>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Âge</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => handleChange('age', e.target.value)}
                  placeholder="Ex: 23"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Poids (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={e => handleChange('weight', e.target.value)}
                  placeholder="Ex: 60"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Taille (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={e => handleChange('height', e.target.value)}
                  placeholder="Ex: 165"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Genre</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'female', label: '👩 Femme' },
                    { value: 'male', label: '👨 Homme' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleChange('gender', opt.value)}
                      className={btnBase + (formData.gender === opt.value ? btnSelected : btnNormal)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.age || !formData.weight || !formData.height || !formData.gender}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                Suivant →
              </button>
            </div>
          )}

          {/* STEP 2 — Niveau d'activité */}
          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white mb-6">Ton niveau d'activité</h2>

              {[
                { value: 'sedentary', label: '🛋️ Sédentaire', desc: 'Peu ou pas d\'exercice' },
                { value: 'light', label: '🚶 Légèrement actif', desc: '1-3 jours/semaine' },
                { value: 'moderate', label: '🏃 Modérément actif', desc: '3-5 jours/semaine' },
                { value: 'active', label: '💪 Très actif', desc: '6-7 jours/semaine' },
                { value: 'very_active', label: '🔥 Extrêmement actif', desc: '2x/jour ou travail physique' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('activityLevel', opt.value)}
                  className={btnBase + (formData.activityLevel === opt.value ? btnSelected : btnNormal)}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-sm opacity-70 mt-0.5">{opt.desc}</span>
                </button>
              ))}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border-2 border-gray-700 text-gray-400 font-bold py-3 rounded-lg hover:border-gray-500 transition-colors"
                >
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.activityLevel}
                  className="w-2/3 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Objectif */}
          {step === 3 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white mb-6">Ton objectif</h2>

              {[
                { value: 'lose', label: '🔥 Perdre du poids', desc: 'Déficit de 500 kcal/jour' },
                { value: 'maintain', label: '⚖️ Maintenir mon poids', desc: 'Calories d\'entretien' },
                { value: 'gain', label: '💪 Prendre de la masse', desc: 'Surplus de 300 kcal/jour' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('goal', opt.value)}
                  className={btnBase + (formData.goal === opt.value ? btnSelected : btnNormal)}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-sm opacity-70 mt-0.5">{opt.desc}</span>
                </button>
              ))}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 border-2 border-gray-700 text-gray-400 font-bold py-3 rounded-lg hover:border-gray-500 transition-colors"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.goal || loading}
                  className="w-2/3 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Calcul...' : '🚀 Calculer mon TDEE'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;