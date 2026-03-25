export type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: Record<BreathingPhase, number>; // duration in seconds, 0 = skip phase
  color: string;
  emoji: string;
}

export interface BreathingSession {
  id: string;
  patternId: string;
  startedAt: number; // unix ms
  durationSeconds: number;
  roundsCompleted: number;
  wasCompleted: boolean;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';
