import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { createFilterPath, drawFilteredVideo, drawVideo } from './frame';

const pixelCanvas = document.createElement('canvas');
const pixelCtx = pixelCanvas.getContext('2d');

const drawGlitch = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawVideo(ctx, video, canvas);

  const sliceHeight = 8;
  const sliceCount = 8;

  for (let i = 0; i < sliceCount; i++) {
    const y = Math.random() * canvas.height;
    const height = sliceHeight + Math.random() * 20;
    const offset = (Math.random() - 0.5) * 40;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, canvas.width, height);
    ctx.clip();
    ctx.translate(offset, 0);

    drawVideo(ctx, video, canvas);

    ctx.restore();
  }
};

const drawRgbSplit = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  ctx.globalCompositeOperation = 'screen';

  ctx.save();
  ctx.filter = 'sepia(1) saturate(8) hue-rotate(315deg)';
  ctx.translate(-8, 0);
  drawVideo(ctx, video, canvas);
  ctx.restore();

  ctx.save();
  ctx.filter = 'sepia(1) saturate(8) hue-rotate(100deg)';
  ctx.translate(8, 0);
  drawVideo(ctx, video, canvas);
  ctx.restore();

  ctx.globalCompositeOperation = 'source-over';
};

const drawVhs = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(ctx, video, canvas, 'contrast(1.25) saturate(1.4) sepia(0.15)');

  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#00ffff';

  for (let y = 0; y < canvas.height; y += 5) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.restore();
};

const drawCyberNeon = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(
    ctx,
    video,
    canvas,
    'contrast(1.5) saturate(3) hue-rotate(150deg) brightness(1.2)',
  );

  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#00ffff';

  for (let y = 0; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 2);
  }

  ctx.restore();
};

const drawThermal = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(
    ctx,
    video,
    canvas,
    'contrast(2) saturate(5) hue-rotate(280deg) brightness(1.2)',
  );
};

const drawPsychedelic = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(ctx, video, canvas, 'saturate(5) contrast(1.4) hue-rotate(90deg)');
};

const drawInverted = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(ctx, video, canvas, 'invert(1) contrast(1.3) saturate(1.4)');
};

const drawPixelate = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  const scale = 0.08;

  const width = Math.max(1, Math.floor(canvas.width * scale));
  const height = Math.max(1, Math.floor(canvas.height * scale));

  if (pixelCanvas.width !== width || pixelCanvas.height !== height) {
    pixelCanvas.width = width;
    pixelCanvas.height = height;
  }

  if (!pixelCtx) return;

  pixelCtx.imageSmoothingEnabled = false;
  pixelCtx.clearRect(0, 0, width, height);
  pixelCtx.drawImage(video, 0, 0, width, height);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(pixelCanvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
  ctx.restore();
};

const drawDream = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  ctx.save();
  ctx.globalAlpha = 0.7;

  drawFilteredVideo(ctx, video, canvas, 'blur(2px) saturate(1.8) brightness(1.15)');

  ctx.globalAlpha = 0.3;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(8px) saturate(2)';

  drawVideo(ctx, video, canvas);

  ctx.restore();
};

const drawHighContrast = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  drawFilteredVideo(ctx, video, canvas, 'contrast(2.2) saturate(1.8) brightness(1.05)');
};

export const FILTER_COUNT = 11;

export const applyFilter = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  hands: NormalizedLandmark[][],
  canvas: HTMLCanvasElement,
  filterIndex: number,
) => {
  if (filterIndex === 0) return;

  ctx.save();

  createFilterPath(ctx, hands, canvas);
  ctx.clip();

  switch (filterIndex) {
    case 1:
      drawGlitch(ctx, video, canvas);
      break;
    case 2:
      drawRgbSplit(ctx, video, canvas);
      break;
    case 3:
      drawVhs(ctx, video, canvas);
      break;
    case 4:
      drawCyberNeon(ctx, video, canvas);
      break;
    case 5:
      drawThermal(ctx, video, canvas);
      break;
    case 6:
      drawPsychedelic(ctx, video, canvas);
      break;
    case 7:
      drawInverted(ctx, video, canvas);
      break;
    case 8:
      drawPixelate(ctx, video, canvas);
      break;
    case 9:
      drawDream(ctx, video, canvas);
      break;
    case 10:
      drawHighContrast(ctx, video, canvas);
      break;
  }

  ctx.restore();
};
