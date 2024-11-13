import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onMainMenu }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
      <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
      <p className="text-2xl mb-8">Final Score: {score}</p>
      <div className="space-x-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
        >
          Try Again
        </button>
        <button
          onClick={onMainMenu}
          className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};