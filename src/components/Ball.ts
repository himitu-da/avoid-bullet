export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export const createBall = (canvasWidth: number, speed: number = 5): Ball => {
  const angle = Math.random() * Math.PI;
  return {
    x: Math.random() * canvasWidth,
    y: 0,
    dx: speed * Math.cos(angle),
    dy: speed * Math.sin(angle) + 2,
  };
};