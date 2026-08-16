import { NOTE_FREQUENCIES } from '../../constants';
import type { ActiveNote, PianoNote } from '../../types';

export class PianoAudio {
  private context: AudioContext | null = null;

  private readonly activeNotes = new Map<PianoNote, ActiveNote>();

  async start() {
    if (!this.context) {
      this.context = new AudioContext();
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  play(note: PianoNote) {
    if (!this.context || this.activeNotes.has(note)) return;

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.value = NOTE_FREQUENCIES[note];

    gain.gain.setValueAtTime(0, this.context.currentTime);

    gain.gain.linearRampToValueAtTime(0.25, this.context.currentTime + 0.01);

    oscillator.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start();

    this.activeNotes.set(note, {
      oscillator,
      gain,
    });
  }

  stop(note: PianoNote) {
    const activeNote = this.activeNotes.get(note);

    if (!activeNote || !this.context) return;

    const now = this.context.currentTime;

    activeNote.gain.gain.cancelScheduledValues(now);
    activeNote.gain.gain.setValueAtTime(activeNote.gain.gain.value, now);

    activeNote.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    activeNote.oscillator.stop(now + 0.1);

    this.activeNotes.delete(note);
  }

  stopAll() {
    for (const note of this.activeNotes.keys()) {
      this.stop(note);
    }
  }

  async destroy() {
    this.stopAll();

    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }
}
