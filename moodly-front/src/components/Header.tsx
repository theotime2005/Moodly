import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { userRole, logout } = useAuth();

  if (!userRole) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#A8E6CF] to-[#7ED3B2] bg-clip-text text-transparent">
              Moodly
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <User size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700 font-medium capitalize">
                {userRole === 'employee' ? 'Employé' : 'Manager'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#A8E6CF] to-[#7ED3B2] text-gray-800 font-medium rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
