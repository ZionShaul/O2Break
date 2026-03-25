import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPattern, BreathingPhase, TimerStatus } from '../types/breathing';
import { getPhaseSequence } from '../utils/breathingPatterns';

interface TimerState {
  status: TimerStatus;
  currentPhase: BreathingPhase;
  phaseProgress: number; // 0..1
  phaseSecondsLeft: number;
  roundsCompleted: number;
  totalElapsedSeconds: number;
}

interface UseBreathingTimerResult extends TimerState {
  start: () => void;
  pause: () => void;
  stop: () => void;
}

export function useBreathingTimer(
  pattern: BreathingPattern,
  targetRounds: number,
  onComplete: (durationSeconds: number, rounds: number) => void
): UseBreathingTimerResult {
  const phases = getPhaseSequence(pattern);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(pattern.phases[phases[0]]);

  const startTimeRef = useRef<number>(0);
  const phaseStartRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const totalPausedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundsRef = useRef(0);
  const phaseIndexRef = useRef(0);

  const currentPhase = phases[phaseIndex];

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus('idle');
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const phaseElapsed = (now - phaseStartRef.current - totalPausedRef.current) / 1000;
    const phaseDuration = pattern.phases[phases[phaseIndexRef.current]];
    const progress = Math.min(phaseElapsed / phaseDuration, 1);
    const secondsLeft = Math.max(Math.ceil(phaseDuration - phaseElapsed), 0);

    setPhaseProgress(progress);
    setPhaseSecondsLeft(secondsLeft);

    if (phaseElapsed >= phaseDuration) {
      // Advance phase
      const nextPhaseIndex = (phaseIndexRef.current + 1) % phases.length;
      const isNewRound = nextPhaseIndex === 0;

      if (isNewRound) {
        const newRounds = roundsRef.current + 1;
        roundsRef.current = newRounds;
        setRoundsCompleted(newRounds);

        if (newRounds >= targetRounds) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus('done');
          const totalElapsed = (now - startTimeRef.current) / 1000;
          onComplete(Math.round(totalElapsed), newRounds);
          return;
        }
      }

      phaseIndexRef.current = nextPhaseIndex;
      phaseStartRef.current = now;
      totalPausedRef.current = 0;
      setPhaseIndex(nextPhaseIndex);
      setPhaseProgress(0);
      setPhaseSecondsLeft(pattern.phases[phases[nextPhaseIndex]]);
    }
  }, [pattern, phases, targetRounds, onComplete]);

  const start = useCallback(() => {
    const now = Date.now();
    startTimeRef.current = now;
    phaseStartRef.current = now;
    totalPausedRef.current = 0;
    roundsRef.current = 0;
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setRoundsCompleted(0);
    setPhaseProgress(0);
    setPhaseSecondsLeft(pattern.phases[phases[0]]);
    setStatus('running');
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 100);
  }, [pattern, phases, tick]);

  const pause = useCallback(() => {
    if (status === 'running') {
      pausedAtRef.current = Date.now();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus('paused');
    } else if (status === 'paused') {
      totalPausedRef.current += Date.now() - pausedAtRef.current;
      intervalRef.current = setInterval(tick, 100);
      setStatus('running');
    }
  }, [status, tick]);

  // Keep tick updated
  useEffect(() => {
    if (status === 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick, status]);

  const totalElapsedSeconds =
    status !== 'idle' ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

  return {
    status,
    currentPhase,
    phaseProgress,
    phaseSecondsLeft,
    roundsCompleted,
    totalElapsedSeconds,
    start,
    pause,
    stop,
  };
}
