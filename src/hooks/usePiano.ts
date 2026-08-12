import { useEffect, useRef } from 'react';

import { useHandTracking } from '../context/HandTrackingContext';
import { PianoAudio } from '../lib/pianoAudio';
import { getFingerAngle, isFingerPressed } from '../utils/handGesture';
import type { FingerName, FingerStates } from '../types';
import { NOTES } from '../constants';

const FINGERS: FingerName[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

const createFingerStates = (): FingerStates => ({
  thumb: false,
  index: false,
  middle: false,
  ring: false,
  pinky: false,
});

export const usePiano = (enabled: boolean, audio: PianoAudio | null) => {
  const { subscribe } = useHandTracking();

  const statesRef = useRef({
    Left: createFingerStates(),
    Right: createFingerStates(),
  });

  useEffect(() => {
    if (!enabled || !audio) return;

    const unsubscribe = subscribe((result) => {
      const hands = result?.landmarks ?? [];
      const handedness = result?.handedness ?? [];

      const seenHands = {
        Left: false,
        Right: false,
      };

      for (let handIndex = 0; handIndex < hands.length; handIndex++) {
        const hand = hands[handIndex];
        const name = handedness[handIndex]?.[0]?.categoryName;

        if (name !== 'Left' && name !== 'Right') {
          continue;
        }

        seenHands[name] = true;

        const previous = statesRef.current[name];

        for (const finger of FINGERS) {
          const angle = getFingerAngle(hand, finger);

          const pressed = isFingerPressed(angle, previous[finger]);
          const note = NOTES[name][finger];

          if (pressed && !previous[finger]) {
            audio.play(note);
          }

          if (!pressed && previous[finger]) {
            audio.stop(note);
          }

          previous[finger] = pressed;
        }
      }

      // stop notes when hand disappears
      for (const name of ['Left', 'Right'] as const) {
        if (!seenHands[name]) {
          for (const finger of FINGERS) {
            const note = NOTES[name][finger];

            if (statesRef.current[name][finger]) {
              audio.stop(note);
            }
          }

          statesRef.current[name] = createFingerStates();
        }
      }
    });

    return () => {
      unsubscribe();
      audio.stopAll();
    };
  }, [audio, enabled, subscribe]);
};
