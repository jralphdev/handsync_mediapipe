import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { toCanvasPoint } from './coordinates';
import { HAND_CONNECTIONS, LANDMARK } from '../../constants';

export const drawHand = (
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  canvas: HTMLCanvasElement,
) => {
  const points = landmarks.map((landmark) => toCanvasPoint(landmark, canvas));

  ctx.strokeStyle = '#0BF40B';
  ctx.fillStyle = '#EB6437';
  ctx.lineWidth = 2;

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
    hands[0][LANDMARK.THUMB_TIP],
    hands[0][LANDMARK.INDEX_TIP],
    hands[1][LANDMARK.INDEX_TIP],
    hands[1][LANDMARK.THUMB_TIP],
  ].map((landmark) => toCanvasPoint(landmark, canvas));

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (const point of points.slice(1)) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();
  ctx.strokeStyle = '#03D6FF';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#FFF';

  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
};
