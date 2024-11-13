import { useCallback, useRef } from 'react';
import { Ball, createBall } from '../components/Ball';

interface GameLoopProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
}

export const useGameLoop = ({ canvasRef, onScoreUpdate, onGameOver }: GameLoopProps) => {
  const playerRef = useRef({ x: 0, y: 0 });
  const ballsRef = useRef<Ball[]>([]);
  const scoreRef = useRef(0);
  const animationFrameRef = useRef(0);
  const lastBallTimeRef = useRef(Date.now());
  const isInitializedRef = useRef(false);

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

      // Draw player
      ctx.beginPath();
      ctx.arc(playerRef.current.x, playerRef.current.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();

      // Create new balls every 3 seconds
      const now = Date.now();
      if (now - lastBallTimeRef.current > 3000) {
        ballsRef.current.push(createBall(canvas.width));
        lastBallTimeRef.current = now;
      }

      // Update and draw balls
      ballsRef.current.forEach((ball) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
        
        // Reset ball position when it reaches bottom and increment score
        if (ball.y > canvas.height) {
          ball.y = 0;
          ball.x = Math.random() * canvas.width;
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
        
        if (distance < 18) {
          onGameOver();
          const highScore = localStorage.getItem('highScore') || '0';
          if (scoreRef.current > parseInt(highScore)) {
            localStorage.setItem('highScore', scoreRef.current.toString());
          }
          return;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, onGameOver, onScoreUpdate]);

  const stopGameLoop = useCallback(() => {
    cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return { startGameLoop, stopGameLoop };
};