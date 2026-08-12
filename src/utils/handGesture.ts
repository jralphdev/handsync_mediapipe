import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { FINGER_JOINTS, LANDMARK } from '../constants';
import type { FingerName } from '../types';

const PINCH_START_RATIO = 0.2;
const PINCH_END_RATIO = 0.32;

const PRESS_ANGLE = 135;
const RELEASE_ANGLE = 155;

const angleBetween = (a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark) => {
  const ab = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const cb = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  const magnitude = Math.hypot(ab.x, ab.y) * Math.hypot(cb.x, cb.y);

  if (magnitude === 0) {
    return 180;
  }

  const dot = ab.x * cb.x + ab.y * cb.y;

  const cosine = Math.max(-1, Math.min(1, dot / magnitude));

  return Math.acos(cosine) * (180 / Math.PI);
};

export const getFingerAngle = (hand: NormalizedLandmark[], finger: FingerName) => {
  const [a, b, c] = FINGER_JOINTS[finger];

  return angleBetween(hand[a], hand[b], hand[c]);
};

export const isFingerPressed = (angle: number, wasPressed: boolean) => {
  return wasPressed ? angle < RELEASE_ANGLE : angle < PRESS_ANGLE;
};

export const isPinching = (hand: NormalizedLandmark[], wasPinching: boolean) => {
  const thumb = hand[LANDMARK.THUMB_TIP];
  const index = hand[LANDMARK.INDEX_TIP];

  const pinchDistance = Math.hypot(thumb.x - index.x, thumb.y - index.y);

  const handSize = Math.hypot(
    hand[LANDMARK.WRIST].x - hand[LANDMARK.MIDDLE_MCP].x,
    hand[LANDMARK.WRIST].y - hand[LANDMARK.MIDDLE_MCP].y,
  );

  if (handSize === 0) {
    return false;
  }

  const ratio = pinchDistance / handSize;
  const threshold = wasPinching ? PINCH_END_RATIO : PINCH_START_RATIO;

  return ratio < threshold;
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
