import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

const THUMB_TIP = 4;
const INDEX_TIP = 8;
const WRIST = 0;
const MIDDLE_MCP = 9;

const PINCH_RATIO = 0.25;

export const isPinching = (hand: NormalizedLandmark[]) => {
  const thumb = hand[THUMB_TIP];
  const index = hand[INDEX_TIP];

  const pinchDistance = Math.hypot(thumb.x - index.x, thumb.y - index.y);

  const handSize = Math.hypot(
    hand[WRIST].x - hand[MIDDLE_MCP].x,
    hand[WRIST].y - hand[MIDDLE_MCP].y,
  );

  return pinchDistance / handSize < PINCH_RATIO;
};

export const isPointingAt = (
  landmark: NormalizedLandmark,
  element: HTMLElement,
  video: HTMLVideoElement,
) => {
  const videoRect = video.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const x = videoRect.left + (1 - landmark.x) * videoRect.width;
  const y = videoRect.top + landmark.y * videoRect.height;

  return (
    x >= elementRect.left &&
    x <= elementRect.right &&
    y >= elementRect.top &&
    y <= elementRect.bottom
  );
};
