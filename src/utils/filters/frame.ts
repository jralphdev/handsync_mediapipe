import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { LANDMARK } from '../../constants';
import { toCanvasPoint } from '../hand/coordinates';

export const createFilterPath = (
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
};

export const drawVideo = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
};

export const drawFilteredVideo = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  filter: string,
) => {
  ctx.save();
  ctx.filter = filter;

  drawVideo(ctx, video, canvas);

  ctx.restore();
};
