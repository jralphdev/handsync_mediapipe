import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

const toCanvasPoint = (landmark: NormalizedLandmark, canvas: HTMLCanvasElement) => ({
  x: landmark.x * canvas.width,
  y: landmark.y * canvas.height,
});

export const drawHand = (
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  canvas: HTMLCanvasElement,
) => {
  const points = landmarks.map((landmark) => toCanvasPoint(landmark, canvas));

  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = 1;

  for (const [start, end] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo(points[start].x, points[start].y);
    ctx.lineTo(points[end].x, points[end].y);
    ctx.stroke();
  }

  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawFilterFrame = (
  ctx: CanvasRenderingContext2D,
  hands: NormalizedLandmark[][],
  canvas: HTMLCanvasElement,
) => {
  const points = [
    hands[0][4], // thumb tip
    hands[0][8], // index finger tip
    hands[1][8], // index finger tip
    hands[1][4], // thumb tip
  ].map((landmark) => toCanvasPoint(landmark, canvas));

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (const point of points.slice(1)) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();

  ctx.strokeStyle = '#03d6ff';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#fff';

  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
};
