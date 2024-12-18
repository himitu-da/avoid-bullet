import { useCallback, useEffect, useRef } from 'react';
import { Ball, createBall } from '../components/Ball';

interface GameLoopProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onScoreUpdate: (score: number) => void;
  onLevelUpdate: (level: number) => void;
  onProgressUpdate: (progress: number) => void;
  onGameOver: () => void;
  initialLevel: number;
}


export const useGameLoop = ({ canvasRef, onScoreUpdate, onLevelUpdate, onProgressUpdate, onGameOver, initialLevel }: GameLoopProps) => {
  const playerRef = useRef({ x: 0, y: 0 });
  const ballsRef = useRef<Ball[]>([]);
  const scoreRef = useRef(0);
  const levelRef = useRef(0);
  const animationFrameRef = useRef(0);
  const lastBallTimeRef = useRef(Date.now() - 10000);
  const isInitializedRef = useRef(false);
  const levelInterval = 7500; // 7.5秒
  const ballspeed = 0.5;

  // ここに追加
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初期ボールの生成
    for (let i = 0; i < 3 * initialLevel - 3; i++) {
      setTimeout(() => {
      ballsRef.current.push(createBall(canvas.width, ballspeed));
    }, i * 50 + 3000); // 0.1秒ごとに生成
    levelRef.current = initialLevel - 1;
  }
  }, []); // 依存配列を空にして初回のみ実行

  const startGameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // プレイヤーの初期位置は最初の1回だけ設定
    if (!isInitializedRef.current) {
      playerRef.current = {
        x: canvas.width / 2,
        y: canvas.height - 100,
      };
      isInitializedRef.current = true;
    }

    const handleMouseMove = (e: MouseEvent) => {
      playerRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new 3 balls every 7.5 seconds and increment level
      const now = Date.now();
      const elapsed = now - lastBallTimeRef.current;
      const progress = (elapsed / levelInterval) * 100;
      onProgressUpdate(progress);

      if (progress >= 100) {
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            ballsRef.current.push(createBall(canvas.width, ballspeed));
          }, i * 300); // Delay each ball by 300ms
        }
        lastBallTimeRef.current = now;
        levelRef.current += 1;
        onLevelUpdate(levelRef.current);
      }

      // Draw player
      ctx.beginPath();
      ctx.arc(playerRef.current.x, playerRef.current.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();

      // Update and draw balls
      ballsRef.current.forEach((ball) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
        
        // Reset ball position when it reaches bottom and increment score
        if (ball.y > canvas.height) {
          ball.y = 0;
          //ball.x = Math.random() * canvas.width;
          scoreRef.current += 1;
          onScoreUpdate(scoreRef.current);
        }

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Collision detection with player
        const dx = ball.x - playerRef.current.x;
        const dy = ball.y - playerRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 14) { // 判定のサイズ
          const highScore = localStorage.getItem('highScore') || '0';
          if (scoreRef.current > parseInt(highScore)) {
            localStorage.setItem('highScore', scoreRef.current.toString());
          }

          // chack is high level and save
          const currentHighLevel = parseInt(localStorage.getItem('highLevel') || '1');
          if (levelRef.current > currentHighLevel) {
            localStorage.setItem('highLevel', levelRef.current.toString());
          }
          onGameOver();
          stopGameLoop();
          return;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, onGameOver, onScoreUpdate, onLevelUpdate]);

  const stopGameLoop = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return { startGameLoop, stopGameLoop };
};