import { useCallback } from 'react';
import * as Speech from 'expo-speech';
import { SessionPhaseLabel, Lang } from '../types';

const CUES: Record<Lang, Record<SessionPhaseLabel, string>> = {
  he: {
    inhale: 'שאיפה',
    exhale: 'נשיפה',
    'hold-top': 'החזק',
    'hold-bottom': 'המתן',
  },
  en: {
    inhale: 'Inhale',
    exhale: 'Exhale',
    'hold-top': 'Hold',
    'hold-bottom': 'Wait',
  },
};

export function useVoiceGuide(enabled: boolean, lang: Lang) {
  const speak = useCallback(
    (phase: SessionPhaseLabel) => {
      if (!enabled) return;
      Speech.stop();
      Speech.speak(CUES[lang][phase], {
        language: lang === 'he' ? 'he-IL' : 'en-US',
        rate: 0.85,
        pitch: 1.0,
      });
    },
    [enabled, lang]
  );

  return { speak };
}
