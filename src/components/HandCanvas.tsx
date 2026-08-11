import { useEffect, useRef } from 'react';
import { drawFilterFrame, drawHand } from '../utils/handDrawing';
import { useHandTracking } from '../context/HandTrackingContext';

type HandCanvasProps = {
  filterEnabled: boolean;
};

const HandCanvas = ({ filterEnabled }: HandCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { videoRef, resultRef } = useHandTracking();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let animationFrame = 0;

    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const renderHands = () => {
      if (!video.videoWidth) {
        animationFrame = requestAnimationFrame(renderHands);
        return;
      }

      // only resize the canvas when the video's actual resolution changes,
      const sizeChanged =
        canvas.width !== video.videoWidth || canvas.height !== video.videoHeight;

      if (sizeChanged) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hands = resultRef.current?.landmarks ?? [];

      for (const hand of hands) {
        drawHand(ctx, hand, canvas);
      }

      if (filterEnabled && hands.length === 2) {
        drawFilterFrame(ctx, hands, canvas);
      }

      animationFrame = requestAnimationFrame(renderHands);
    };

    renderHands();

    return () => cancelAnimationFrame(animationFrame);
  }, [resultRef, videoRef, filterEnabled]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className='video' />

      <canvas ref={canvasRef} className='canvas' />
    </>
  );
};

export default HandCanvas;
