import { useEffect, useRef } from 'react';
import { createHandLandmarker } from '../lib/mediapipe';

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

const HandCanvas = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let frame = 0;
    let stream: MediaStream | undefined;
    let handLandmarker: Awaited<ReturnType<typeof createHandLandmarker>> | undefined;

    const start = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;
      await video.play();

      handLandmarker = await createHandLandmarker();

      const detect = () => {
        if (!video.videoWidth || !video.videoHeight) {
          frame = requestAnimationFrame(detect);
          return;
        }

        // only resize the canvas when the video's actual resolution changes,
        const sizeChanged =
          canvas.width !== video.videoWidth || canvas.height !== video.videoHeight;

        if (sizeChanged) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const result = handLandmarker?.detectForVideo(video, performance.now());

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (result?.landmarks.length) {
          // show skeleton for every detected hand
          for (const hand of result.landmarks) {
            const points = hand.map((point) => ({
              x: point.x * canvas.width,
              y: point.y * canvas.height,
            }));

            for (const [start, end] of HAND_CONNECTIONS) {
              ctx.beginPath();
              ctx.moveTo(points[start].x, points[start].y);
              ctx.lineTo(points[end].x, points[end].y);
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            for (const point of points) {
              ctx.beginPath();
              ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#fff';
              ctx.fill();
            }
          }
        }

        // show filter frame only when both hands are detected
        if (result?.landmarks.length === 2) {
          const [first, second] = result.landmarks;

          const points = [first[4], first[8], second[8], second[4]].map((point) => ({
            x: point.x * canvas.width,
            y: point.y * canvas.height,
          }));

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (const point of points.slice(1)) {
            ctx.lineTo(point.x, point.y);
          }

          ctx.closePath();

          ctx.strokeStyle = '#03d6ff';
          ctx.lineWidth = 1;
          ctx.stroke();

          for (const point of points) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
          }
        }

        frame = requestAnimationFrame(detect);
      };

      detect();
    };

    start();

    return () => {
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      handLandmarker?.close();
    };
  }, []);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className='video' />

      <canvas ref={canvasRef} className='canvas' />
    </>
  );
};

export default HandCanvas;
