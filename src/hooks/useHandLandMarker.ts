import { useCallback, useEffect, useRef } from 'react';

import type { Listener } from '../types';
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { startHandTrackingLoop } from '../lib/mediapipe/handTrackingLoop';
import { createHandLandmarker } from '../lib/mediapipe/createHandLandmarker';

export const useHandLandmarker = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const latestResultRef = useRef<HandLandmarkerResult | null>(null);
  const listenersRef = useRef(new Set<Listener>());

  const subscribe = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);

    return () => listenersRef.current.delete(listener);
  }, []);

  useEffect(() => {
    let stream: MediaStream | undefined;
    let stopTracking: (() => void) | undefined;
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
          audio: false,
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

        stopTracking = startHandTrackingLoop({
          video,
          landmarker,
          onResult: (result) => {
            latestResultRef.current = result;

            for (const listener of listenersRef.current) {
              listener(result);
            }
          },
        });
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to start hand tracking:', error);
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      stopTracking?.();
      stream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      video.pause();
      video.srcObject = null;
      latestResultRef.current = null;
    };
  }, []);

  return {
    videoRef,
    latestResultRef,
    subscribe,
  };
};
