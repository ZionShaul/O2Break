import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { SessionPhaseLabel } from '../types';

export function useHaptics() {
  const triggerPhase = useCallback((phase: SessionPhaseLabel) => {
    if (phase === 'inhale') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    } else if (phase === 'exhale') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    } else if (phase === 'hold-top' || phase === 'hold-bottom') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, []);

  return { triggerPhase };
}
