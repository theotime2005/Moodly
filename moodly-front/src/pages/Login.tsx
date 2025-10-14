import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleTestLogin = (role: 'employee' | 'manager') => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DCEBF7] via-[#FFF5E4] to-[#A8E6CF] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Moodly</h1>
          <p className="text-gray-600">Bienvenue sur votre espace bien-être</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8E6CF] transition-all"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8E6CF] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-[#A8E6CF] to-[#7ED3B2] text-gray-800 font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Se connecter
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Ou tester avec</span>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTestLogin('employee')}
            className="w-full bg-[#DCEBF7] text-gray-800 font-medium py-3 rounded-xl hover:bg-[#C5DCF0] transition-all duration-300"
          >
            Connexion Employé
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTestLogin('manager')}
            className="w-full bg-[#FFF5E4] text-gray-800 font-medium py-3 rounded-xl hover:bg-[#FFE8C5] transition-all duration-300"
          >
            Connexion Manager
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
