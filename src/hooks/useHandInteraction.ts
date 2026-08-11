import { useEffect, useRef, useState } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { isPinching, isPointingAt } from '../utils/handGesture';

const CLICK_COOLDOWN = 500;

export const useHandInteraction = (
  targetRef: React.RefObject<HTMLElement | null>,
  onClick: () => void,
) => {
  const { videoRef, resultRef } = useHandTracking();

  const [isHovering, setIsHovering] = useState(false);

  const pinchingRef = useRef(false);
  const lastClickRef = useRef(0);

  useEffect(() => {
    let animationFrame = 0;

    const checkInteraction = () => {
      const hand = resultRef.current?.landmarks[0];
      const video = videoRef.current;
      const target = targetRef.current;

      if (!hand || !video || !target) {
        setIsHovering(false);
        pinchingRef.current = false;
      } else {
        const hovering = isPointingAt(hand[8], target, video);
        const pinching = isPinching(hand);

        setIsHovering(hovering);

        const now = performance.now();
        const canClick = now - lastClickRef.current > CLICK_COOLDOWN;

        if (hovering && pinching && !pinchingRef.current && canClick) {
          lastClickRef.current = now;
          onClick();
        }

        pinchingRef.current = pinching;
      }

      animationFrame = requestAnimationFrame(checkInteraction);
    };

    checkInteraction();

    return () => cancelAnimationFrame(animationFrame);
  }, [resultRef, videoRef, targetRef, onClick]);

  return isHovering;
};
