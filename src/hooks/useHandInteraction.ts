import { useEffect, useRef, useState } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { LANDMARK } from '../constants';
import { isPinching, isPointingAt } from '../utils/hand/gestures';

export const useHandInteraction = (
  targetRef: React.RefObject<HTMLElement | null>,
  onClick: () => void,
) => {
  const { videoRef, subscribe } = useHandTracking();

  const [isHovering, setIsHovering] = useState(false);

  const hoveringRef = useRef(false);
  const pinchingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribe((result) => {
      const video = videoRef.current;
      const target = targetRef.current;

      if (!video || !target || !result) return;

      const hands = result.landmarks ?? [];

      if (hands.length === 0) {
        if (hoveringRef.current) {
          hoveringRef.current = false;
          setIsHovering(false);
        }

        pinchingRef.current = false;

        return;
      }

      let hovering = false;
      let pinching = false;

      for (const hand of hands) {
        const indexTip = hand[LANDMARK.INDEX_TIP];

        const handHovering = isPointingAt(indexTip, target, video);

        if (!handHovering) continue;

        hovering = true;

        const handPinching = isPinching(hand, pinchingRef.current);

        if (handPinching) pinching = true;
      }

      if (hovering !== hoveringRef.current) {
        hoveringRef.current = hovering;
        setIsHovering(hovering);
      }

      if (hovering && pinching && !pinchingRef.current) {
        onClick();
      }

      pinchingRef.current = pinching;
    });

    return unsubscribe;
  }, [onClick, subscribe, targetRef, videoRef]);

  return isHovering;
};
