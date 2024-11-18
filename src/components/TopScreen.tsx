import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Trophy } from 'lucide-react';

const TopScreen: React.FC = () => {
  const navigate = useNavigate();
  const highScore = localStorage.getItem('highScore') || '0';
  const [level, setLevel] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-black to-gray-900">
      <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
        だんだん難しくなる弾幕ゲーム
      </h1>
      
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => navigate('/game', { state: { level } })}
          className="group relative px-8 py-4 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6" />
            <span className="text-2xl font-bold">START</span>
          </div>
          <div className="absolute inset-0 border-2 border-red-300 rounded-lg opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
        </button>

        <div className="flex items-center space-x-2 text-xl">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span>High Score: {highScore}</span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2 mt-4">
  <div className="flex items-center space-x-2">
    <span className="text-xl">Level: {level}</span>
  </div>
  
  <input
    type="range"
    min="1"
    max="100"
    value={level}
    onChange={(e) => setLevel(parseInt(e.target.value))}
    className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
  />
  
  <div className="flex justify-between w-64">
    <span className="text-sm">1</span>
    <span className="text-sm">50</span>
    <span className="text-sm">100</span>
  </div>
</div>
    </div>
  );
};

export default TopScreen;