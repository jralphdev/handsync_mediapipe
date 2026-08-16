import { useEffect, useRef } from 'react';
import { useHandTracking } from '../context/HandTrackingContext';
import type { HandCanvasProps } from '../types';
import { applyFilter } from '../utils/filters/effects';
import { drawFilterFrame, drawHand } from '../utils/hand/drawing';

const HandCanvas = ({ filterEnabled, filterIndex }: HandCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { videoRef, subscribe } = useHandTracking();

  useEffect(() => {
    const canvas = canvasRef.current;

    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const unsubscribe = subscribe((result) => {
      if (!video.videoWidth) return;

      const sizeChanged =
        canvas.width !== video.videoWidth || canvas.height !== video.videoHeight;

      if (sizeChanged) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hands = result?.landmarks ?? [];

      for (const hand of hands) {
        drawHand(ctx, hand, canvas);
      }

      if (filterEnabled && hands.length === 2) {
        applyFilter(ctx, video, hands, canvas, filterIndex);
        drawFilterFrame(ctx, hands, canvas);
      }
    });

    return unsubscribe;
  }, [filterEnabled, filterIndex, subscribe, videoRef]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className='video' />

      <canvas ref={canvasRef} className='canvas' />
    </>
  );
};

export default HandCanvas;
