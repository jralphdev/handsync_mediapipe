import { useCallback, useEffect, useRef } from 'react';

import { createHandLandmarker } from '../lib/mediapipe';
import type { Listener } from '../types';

export const useHandLandmarker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const listenersRef = useRef(new Set<Listener>());

  const subscribe = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    let stream: MediaStream | undefined;
    let landmarker: Awaited<ReturnType<typeof createHandLandmarker>>;
    let cancelled = false;

    const video = videoRef.current;
    if (!video) return;

    const start = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (cancelled) {
          cameraStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = cameraStream;
        video.srcObject = stream;

        await video.play();

        if (cancelled) return;

        const handLandmarker = await createHandLandmarker();

        if (cancelled) {
          handLandmarker.close();
          return;
        }

        landmarker = handLandmarker;

        const detect = () => {
          if (cancelled) return;

          if (video.videoWidth) {
            const result = landmarker.detectForVideo(video, performance.now());

            listenersRef.current.forEach((listener) => {
              listener(result);
            });
          }

          animationFrame = requestAnimationFrame(detect);
        };

        detect();
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to start hand tracking:', error);
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      video.pause();
      video.srcObject = null;
    };
  }, []);

  return {
    videoRef,
    subscribe,
  };
};
