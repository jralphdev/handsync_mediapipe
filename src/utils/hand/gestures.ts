import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import type { FingerName } from '../../types';
import { FINGER_JOINTS, FINGER_PRESS, LANDMARK, PINCH_GESTURE } from '../../constants';
import { normalizedToVideoPoint } from './coordinates';

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

  if (magnitude === 0) return 180;

  const dot = ab.x * cb.x + ab.y * cb.y;
  const cosine = Math.max(-1, Math.min(1, dot / magnitude));

  return Math.acos(cosine) * (180 / Math.PI);
};

const distance3D = (a: NormalizedLandmark, b: NormalizedLandmark) => {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
};

export const getFingerAngle = (hand: NormalizedLandmark[], finger: FingerName) => {
  const [a, b, c] = FINGER_JOINTS[finger];

  return angleBetween(hand[a], hand[b], hand[c]);
};

export const isFingerPressed = (angle: number, wasPressed: boolean) => {
  return wasPressed ? angle < FINGER_PRESS.releaseAngle : angle < FINGER_PRESS.pressAngle;
};

export const isPinching = (hand: NormalizedLandmark[], wasPinching: boolean) => {
  const thumb = hand[LANDMARK.THUMB_TIP];
  const index = hand[LANDMARK.INDEX_TIP];

  const pinchDistance = distance3D(thumb, index);

  const handSize = distance3D(hand[LANDMARK.WRIST], hand[LANDMARK.MIDDLE_MCP]);

  if (handSize === 0) return false;

  const ratio = pinchDistance / handSize;
  const threshold = wasPinching ? PINCH_GESTURE.endRatio : PINCH_GESTURE.startRatio;

  return ratio < threshold;
};

export const isPointingAt = (
  landmark: NormalizedLandmark,
  element: HTMLElement,
  video: HTMLVideoElement,
) => {
  const point = normalizedToVideoPoint(landmark, video);
  const rect = element.getBoundingClientRect();

  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
};
