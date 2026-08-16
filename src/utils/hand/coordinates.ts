import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type ViewportPoint = {
  x: number;
  y: number;
};

export const toCanvasPoint = (landmark: NormalizedLandmark, canvas: HTMLCanvasElement) => ({
  x: landmark.x * canvas.width,
  y: landmark.y * canvas.height,
});

export const normalizedToVideoPoint = (
  landmark: NormalizedLandmark,
  video: HTMLVideoElement,
): ViewportPoint => {
  const rect = video.getBoundingClientRect();

  const sourceWidth = video.videoWidth;
  const sourceHeight = video.videoHeight;

  if (!sourceWidth || !sourceHeight) {
    return {
      x: rect.left,
      y: rect.top,
    };
  }

  const scale = Math.max(rect.width / sourceWidth, rect.height / sourceHeight);

  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;

  const cropX = (renderedWidth - rect.width) / 2;
  const cropY = (renderedHeight - rect.height) / 2;

  const renderedX = (1 - landmark.x) * renderedWidth;
  const renderedY = landmark.y * renderedHeight;

  return {
    x: rect.left + renderedX - cropX,
    y: rect.top + renderedY - cropY,
  };
};
