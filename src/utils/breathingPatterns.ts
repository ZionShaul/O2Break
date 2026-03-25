import { BreathingPattern } from '../types/breathing';

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4 counts each phase — equal rhythm, great for focus',
    phases: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    color: '#4A90D9',
    emoji: '🟦',
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Long exhale activates relaxation — ideal for sleep & anxiety',
    phases: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    color: '#7B68EE',
    emoji: '💜',
  },
  {
    id: 'deep46',
    name: 'Deep Breathing',
    description: 'Simple deep breath — perfect for beginners',
    phases: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
    color: '#48BB78',
    emoji: '🌿',
  },
];

export function getPatternById(id: string): BreathingPattern | undefined {
  return BREATHING_PATTERNS.find((p) => p.id === id);
}

export function getPhaseName(phase: string): string {
  switch (phase) {
    case 'inhale': return 'שאף';
    case 'hold1': return 'החזק';
    case 'exhale': return 'נשוף';
    case 'hold2': return 'החזק';
    default: return '';
  }
}

export function getPhaseNameEn(phase: string): string {
  switch (phase) {
    case 'inhale': return 'Inhale';
    case 'hold1': return 'Hold';
    case 'exhale': return 'Exhale';
    case 'hold2': return 'Hold';
    default: return '';
  }
}

export function getPhaseSequence(pattern: BreathingPattern): Array<keyof typeof pattern.phases> {
  const allPhases: Array<keyof typeof pattern.phases> = ['inhale', 'hold1', 'exhale', 'hold2'];
  return allPhases.filter((p) => pattern.phases[p] > 0);
}

export function getPatternTotalSeconds(pattern: BreathingPattern): number {
  return Object.values(pattern.phases).reduce((sum, v) => sum + v, 0);
}
