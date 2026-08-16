import type { HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

type FrameListener = (result: HandLandmarkerResult) => void;

type TrackingLoopOptions = {
  video: HTMLVideoElement;
  landmarker: HandLandmarker;
  onResult: FrameListener;
};

export const startHandTrackingLoop = ({
  video,
  landmarker,
  onResult,
}: TrackingLoopOptions) => {
  let cancelled = false;
  let frameRequest = 0;

  const processFrame = (_now: number, metadata: VideoFrameCallbackMetadata) => {
    if (cancelled) return;

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      const result = landmarker.detectForVideo(video, metadata.mediaTime * 1000);

      onResult(result);
    }

    frameRequest = video.requestVideoFrameCallback(processFrame);
  };

  frameRequest = video.requestVideoFrameCallback(processFrame);

  return () => {
    cancelled = true;
    video.cancelVideoFrameCallback(frameRequest);
  };
};
