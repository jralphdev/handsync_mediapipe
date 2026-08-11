import { useEffect, useRef } from 'react';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';

import { createHandLandmarker } from '../lib/mediapipe';

export const useHandLandmarker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resultRef = useRef<HandLandmarkerResult | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let stream: MediaStream | undefined;
    let landmarker: Awaited<ReturnType<typeof createHandLandmarker>>;

    const start = async () => {
      const video = videoRef.current;

      if (!video) return;

      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;
      await video.play();

      landmarker = await createHandLandmarker();

      const detect = () => {
        if (video.videoWidth) {
          resultRef.current = landmarker.detectForVideo(video, performance.now());
        }

        animationFrame = requestAnimationFrame(detect);
      };

      detect();
    };

    start();

    return () => {
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
    };
  }, []);

  return {
    videoRef,
    resultRef,
  };
};
