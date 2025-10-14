import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, Check } from 'lucide-react';

type Mood = 'happy' | 'neutral' | 'sad' | null;

const tags = [
  'Charge de travail',
  'Ambiance',
  'Management',
  'Autre'
];

export const EmployeeView: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (selectedMood) {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedMood(null);
        setSelectedTag(tags[0]);
      }, 3000);
    }
  };

  const moodButtons = [
    { id: 'happy', icon: Smile, emoji: '😊', label: 'Bien', color: 'from-green-400 to-[#A8E6CF]' },
    { id: 'neutral', icon: Meh, emoji: '😐', label: 'Moyen', color: 'from-yellow-300 to-yellow-400' },
    { id: 'sad', icon: Frown, emoji: '😞', label: 'Difficile', color: 'from-orange-300 to-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E4] via-white to-[#DCEBF7] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
            Comment te sens-tu aujourd'hui ?
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Partage ton ressenti pour améliorer le bien-être de l'équipe
          </p>

          <div className="space-y-8">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Ton humeur
              </label>
              <div className="grid grid-cols-3 gap-4">
                {moodButtons.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.id as Mood)}
                    className={`relative p-6 rounded-2xl transition-all duration-300 ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-br ${mood.color} shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-5xl mb-2">{mood.emoji}</div>
                    <div className={`text-sm font-medium ${
                      selectedMood === mood.id ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {mood.label}
                    </div>
                    {selectedMood === mood.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1"
                      >
                        <Check size={16} className="text-gray-800" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tag Selection */}
            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
                Contexte (optionnel)
              </label>
              <select
                id="tag"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8E6CF] transition-all bg-white"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!selectedMood}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                selectedMood
                  ? 'bg-gradient-to-r from-[#A8E6CF] to-[#7ED3B2] text-gray-800 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Envoyer mon moral
            </motion.button>
          </div>
        </motion.div>

        {/* Confirmation Message */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-6xl mb-4"
                >
                  💚
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Merci !
                </h2>
                <p className="text-gray-600">
                  Ton ressenti a bien été pris en compte
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
