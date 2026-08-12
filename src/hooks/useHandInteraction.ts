import { useEffect, useRef, useState } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { isPinching, isPointingAt } from '../utils/handGesture';
import { LANDMARK } from '../constants';

export const useHandInteraction = (
  targetRef: React.RefObject<HTMLElement | null>,
  onClick: () => void,
) => {
  const { videoRef, subscribe } = useHandTracking();

  const [isHovering, setIsHovering] = useState(false);
  const pinchingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribe((result) => {
      const hand = result?.landmarks[0];
      const video = videoRef.current;
      const target = targetRef.current;

      if (!hand || !video || !target) {
        setIsHovering(false);
        pinchingRef.current = false;
        return;
      }

      const hovering = isPointingAt(hand[LANDMARK.INDEX_TIP], target, video);
      const pinching = isPinching(hand, pinchingRef.current);

      setIsHovering(hovering);

      if (hovering && pinching && !pinchingRef.current) {
        onClick();
      }

      pinchingRef.current = pinching;
    });

    return unsubscribe;
  }, [onClick, subscribe, targetRef, videoRef]);

  return isHovering;
};
