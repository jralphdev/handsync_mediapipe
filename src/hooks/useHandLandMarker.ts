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
    let cancelled = false;

    const start = async () => {
      const video = videoRef.current;

      if (!video) return;

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
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
        if (video.videoWidth) {
          resultRef.current = landmarker.detectForVideo(video, performance.now());
        }

        animationFrame = requestAnimationFrame(detect);
      };

      detect();
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      resultRef.current = null;
    };
  }, []);

  return {
    videoRef,
    resultRef,
  };
};
