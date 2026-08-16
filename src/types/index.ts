import type { HandLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import type { NOTE_FREQUENCIES } from '../constants';

export type Listener = (result: HandLandmarkerResult | null) => void;

export type HandTrackingContextValue = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  latestResultRef: React.RefObject<HandLandmarkerResult | null>;
  subscribe: (listener: Listener) => () => void;
};

export type HandSide = 'Left' | 'Right';

export type HandData = {
  landmarks: NormalizedLandmark[];
  handedness: HandLandmarkerResult['handedness'][number];
  index: number;
};

export type HandCanvasProps = {
  filterEnabled: boolean;
  filterIndex: number;
};

export type HandControlsProps = {
  filterEnabled: boolean;
  pianoEnabled: boolean;
  onFilter: () => void;
  onPiano: () => void;
  onClose: () => void;
};

export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
export type FingerStates = Record<FingerName, boolean>;

export type PianoNote = keyof typeof NOTE_FREQUENCIES;
export type ActiveNote = {
  oscillator: OscillatorNode;
  gain: GainNode;
};
