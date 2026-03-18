// Navigation
export type Screen =
  | 'Home'
  | 'ProgramList'
  | 'ProgramDetail'
  | 'Session'
  | 'SessionComplete';

export interface NavigationState {
  screen: Screen;
  selectedProgramId?: string;
  sessionResult?: SessionResult;
}

// Breathing Programs
export type BreathStyle =
  | 'classic'
  | 'holotropic'
  | 'clarity'
  | 'fire'
  | 'earth'
  | 'water';

export type IntensityLevel = 'gentle' | 'medium' | 'intense';

export interface BreathPhase {
  label: 'inhale' | 'exhale' | 'hold-top' | 'hold-bottom';
  labelHe: string;
  labelEn: string;
  durationMs: number;
}

export interface BreathingProgram {
  id: string;
  nameEn: string;
  nameHe: string;
  taglineEn: string;
  taglineHe: string;
  descriptionEn: string;
  descriptionHe: string;
  origin: string;
  style: BreathStyle;
  intensity: IntensityLevel;
  defaultDurationMinutes: number;
  phases: BreathPhase[];
  gradient: [string, string, string];
  accentColor: string;
  particleColor: string;
}

// Session State
export type SessionPhaseLabel = BreathPhase['label'];

export type SessionStatus = 'idle' | 'running' | 'paused' | 'complete';

export interface SessionState {
  status: SessionStatus;
  currentPhase: SessionPhaseLabel;
  currentPhaseIndex: number;
  elapsedMs: number;
  totalDurationMs: number;
  cycleCount: number;
  phaseElapsedMs: number;
}

// Post-session
export interface SessionResult {
  programId: string;
  durationMs: number;
  cycleCount: number;
  completedAt: Date;
}
