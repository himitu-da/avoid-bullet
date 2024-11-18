import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ball, createBall } from './Ball';
import { GameOver } from './GameOver';
import { useGameLoop } from '../hooks/useGameLoop';

const GameScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const initialLevel = location.state?.level || 1;
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(initialLevel);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isCountDown, setIsCountDown] = useState<boolean>(true);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  
  const { startGameLoop, stopGameLoop } = useGameLoop({
    canvasRef,
    onScoreUpdate: setScore,
    onLevelUpdate: setLevel,
    onProgressUpdate: setProgress,
    onGameOver: () => setGameOver(true),
    initialLevel: initialLevel,
  });

  useEffect(() => {
    if (countdown !== null) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timer);
            setCountdown(null);
            setIsCountDown(false);
            setIsGameStarted(true);
            return null;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!isCountDown && isGameStarted) {
      startGameLoop();
      return () => {
        stopGameLoop();
      };
    }
  }, [isCountDown, startGameLoop, stopGameLoop]);

  if (gameOver) {
    return <GameOver score={score} onRestart={() => window.location.reload()} onMainMenu={() => navigate('/')} />;
  }

  return (
    <div className="relative">
      {countdown !== null && (
        <div className="fixed inset-0 flex items-center justify-center text-5xl font-bold">
          {countdown > 0 ? countdown : '開始!'}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="cursor-none"
      />
      <div className="fixed top-4 right-4 text-2xl font-bold">
        Score: {score}
      </div>
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center">
        Level: {level}
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-300 rounded-full shadow-l">
        <div
          className="h-4 bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default GameScreen;