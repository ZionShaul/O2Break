import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { SessionPhaseLabel } from '../types';

export function useHaptics() {
  const triggerPhase = useCallback((phase: SessionPhaseLabel) => {
    if (phase === 'inhale') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } else if (phase === 'exhale') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    }
  }, []);

  return { triggerPhase };
}
