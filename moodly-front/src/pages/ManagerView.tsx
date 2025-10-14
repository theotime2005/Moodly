import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Filter } from 'lucide-react';

const tags = [
  'Tous',
  'Charge de travail',
  'Ambiance',
  'Management',
  'Autre'
];

// Mock data for 30 days
const generateMockData = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic mood data (scale 1-3: 1=sad, 2=neutral, 3=happy)
    const happyCount = Math.floor(Math.random() * 5) + 8;
    const neutralCount = Math.floor(Math.random() * 4) + 3;
    const sadCount = Math.floor(Math.random() * 3) + 1;
    const total = happyCount + neutralCount + sadCount;

    // Calculate average mood score (weighted)
    const avgMood = ((happyCount * 3 + neutralCount * 2 + sadCount * 1) / total).toFixed(2);

    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      score: parseFloat(avgMood),
      happy: happyCount,
      neutral: neutralCount,
      sad: sadCount,
      total: total
    });
  }

  return data;
};

const mockData = generateMockData();

export const ManagerView: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('Tous');

  // Calculate team statistics
  const latestData = mockData[mockData.length - 1];
  const previousData = mockData[mockData.length - 8];
  const trend = ((latestData.score - previousData.score) / previousData.score * 100).toFixed(1);
  const avgScore = (mockData.reduce((acc, d) => acc + d.score, 0) / mockData.length).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DCEBF7] via-white to-[#A8E6CF] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Vue d'ensemble du moral de l'équipe
          </h1>
          <p className="text-gray-600">
            Tendances et insights sur les 30 derniers jours
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Score moyen</span>
              <TrendingUp className="text-[#A8E6CF]" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-800">{avgScore}</div>
            <div className="text-xs text-gray-500 mt-1">sur 3.00</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Tendance (7j)</span>
              <span className="text-2xl">{parseFloat(trend) >= 0 ? '📈' : '📉'}</span>
            </div>
            <div className={`text-3xl font-bold ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
            <div className="text-xs text-gray-500 mt-1">vs semaine précédente</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Aujourd'hui</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{latestData.total}</div>
            <div className="text-xs text-gray-500 mt-1">réponses reçues</div>
          </motion.div>
        </div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrer par contexte :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-[#A8E6CF] to-[#7ED3B2] text-gray-800 shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Évolution du moral
          </h2>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[1, 3]}
                ticks={[1, 1.5, 2, 2.5, 3]}
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#A8E6CF"
                strokeWidth={3}
                dot={{ fill: '#A8E6CF', r: 4 }}
                activeDot={{ r: 6 }}
                name="Score moyen"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Mood Distribution */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition actuelle</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl mb-2">😊</div>
                <div className="text-2xl font-bold text-gray-800">{latestData.happy}</div>
                <div className="text-xs text-gray-600">Bien</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl mb-2">😐</div>
                <div className="text-2xl font-bold text-gray-800">{latestData.neutral}</div>
                <div className="text-xs text-gray-600">Moyen</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl mb-2">😞</div>
                <div className="text-2xl font-bold text-gray-800">{latestData.sad}</div>
                <div className="text-xs text-gray-600">Difficile</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
