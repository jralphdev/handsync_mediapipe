import { useEffect, useRef } from 'react';

import { drawFilterFrame, drawHand } from '../utils/handDrawing';
import { applyFilter } from '../utils/filterEffect';
import { useHandTracking } from '../context/HandTrackingContext';

type HandCanvasProps = {
  filterEnabled: boolean;
  filterIndex: number;
};

const HandCanvas = ({ filterEnabled, filterIndex }: HandCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { videoRef, resultRef } = useHandTracking();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let animationFrame = 0;

    const render = () => {
      if (!video.videoWidth) {
        animationFrame = requestAnimationFrame(render);
        return;
      }

      const sizeChanged =
        canvas.width !== video.videoWidth || canvas.height !== video.videoHeight;

      if (sizeChanged) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hands = resultRef.current?.landmarks ?? [];

      if (filterEnabled && hands.length === 2) {
        applyFilter(ctx, video, hands, canvas, filterIndex);

        drawFilterFrame(ctx, hands, canvas);
      }

      for (const hand of hands) {
        drawHand(ctx, hand, canvas);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, [filterEnabled, filterIndex, resultRef, videoRef]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className='video' />

      <canvas ref={canvasRef} className='canvas' />
    </>
  );
};

export default HandCanvas;
