import { useEffect, useRef } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { isPinching } from '../utils/hand/gestures';

const PINCH_COOLDOWN = 500;

export const useFilterChange = (enabled: boolean, onChange: () => void) => {
  const { subscribe } = useHandTracking();

  const pinchingRef = useRef(false);
  const lastChangeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      pinchingRef.current = false;
      return;
    }

    const unsubscribe = subscribe((result) => {
      const hands = result?.landmarks ?? [];
      const pinching = hands.some((hand) => isPinching(hand, pinchingRef.current));

      const now = performance.now();

      if (pinching && !pinchingRef.current && now - lastChangeRef.current > PINCH_COOLDOWN) {
        lastChangeRef.current = now;
        onChange();
      }

      pinchingRef.current = pinching;
    });

    return unsubscribe;
  }, [enabled, onChange, subscribe]);
};
