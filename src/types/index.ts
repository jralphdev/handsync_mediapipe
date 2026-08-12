import type { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import type { NOTE_FREQUENCIES } from '../constants';

export type Listener = (result: HandLandmarkerResult | null) => void;
export type HandTrackingContextValue = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  subscribe: (listener: Listener) => () => void;
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
