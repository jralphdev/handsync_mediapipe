import { useEffect, useRef } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { isPinching } from '../utils/handGesture';

const PINCH_COOLDOWN = 500;

export const useFilterChange = (enabled: boolean, onChange: () => void) => {
  const { resultRef } = useHandTracking();

  const pinchingRef = useRef(false);
  const lastChangeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      pinchingRef.current = false;
      return;
    }

    let animationFrame = 0;

    const checkPinch = () => {
      const hands = resultRef.current?.landmarks ?? [];

      const pinching = hands.some(isPinching);
      const now = performance.now();

      if (pinching && !pinchingRef.current && now - lastChangeRef.current > PINCH_COOLDOWN) {
        lastChangeRef.current = now;
        onChange();
      }

      pinchingRef.current = pinching;

      animationFrame = requestAnimationFrame(checkPinch);
    };

    checkPinch();

    return () => cancelAnimationFrame(animationFrame);
  }, [enabled, resultRef, onChange]);
};
