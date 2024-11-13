import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ball, createBall } from './Ball';
import { GameOver } from './GameOver';
import { useGameLoop } from '../hooks/useGameLoop';

const GameScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();
  
  const { startGameLoop, stopGameLoop } = useGameLoop({
    canvasRef,
    onScoreUpdate: setScore,
    onGameOver: () => setGameOver(true),
  });

  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, [startGameLoop, stopGameLoop]);

  if (gameOver) {
    return <GameOver score={score} onRestart={() => window.location.reload()} onMainMenu={() => navigate('/')} />;
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="cursor-none"
      />
      <div className="fixed top-4 right-4 text-2xl font-bold">
        Score: {score}
      </div>
    </div>
  );
};

export default GameScreen;