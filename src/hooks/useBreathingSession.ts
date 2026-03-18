import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingProgram, SessionState, SessionResult } from '../types';

const TICK_MS = 50;

export function useBreathingSession(program: BreathingProgram, durationMinutes?: number) {
  const totalDurationMs = (durationMinutes ?? program.defaultDurationMinutes) * 60 * 1000;

  const [state, setState] = useState<SessionState>({
    status: 'idle',
    currentPhase: program.phases[0].label,
    currentPhaseIndex: 0,
    elapsedMs: 0,
    totalDurationMs,
    cycleCount: 0,
    phaseElapsedMs: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'running') return prev;

      const newElapsed = prev.elapsedMs + TICK_MS;
      const newPhaseElapsed = prev.phaseElapsedMs + TICK_MS;

      if (newElapsed >= totalDurationMs) {
        return { ...prev, status: 'complete', elapsedMs: totalDurationMs };
      }

      const currentPhaseDef = program.phases[prev.currentPhaseIndex];
      if (newPhaseElapsed >= currentPhaseDef.durationMs) {
        const nextIndex = (prev.currentPhaseIndex + 1) % program.phases.length;
        const isNewCycle = nextIndex === 0;
        return {
          ...prev,
          elapsedMs: newElapsed,
          phaseElapsedMs: 0,
          currentPhaseIndex: nextIndex,
          currentPhase: program.phases[nextIndex].label,
          cycleCount: isNewCycle ? prev.cycleCount + 1 : prev.cycleCount,
        };
      }

      return {
        ...prev,
        elapsedMs: newElapsed,
        phaseElapsedMs: newPhaseElapsed,
      };
    });
  }, [program, totalDurationMs]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, status: 'running' }));
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [tick]);

  const pause = useCallback(() => {
    clearTick();
    setState(prev => ({ ...prev, status: 'paused' }));
  }, [clearTick]);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, status: 'running' }));
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [tick]);

  const stop = useCallback(() => {
    clearTick();
    setState(prev => ({ ...prev, status: 'complete' }));
  }, [clearTick]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return clearTick;
  }, [clearTick]);

  const getResult = useCallback((): SessionResult => ({
    programId: program.id,
    durationMs: state.elapsedMs,
    cycleCount: state.cycleCount,
    completedAt: new Date(),
  }), [program.id, state.elapsedMs, state.cycleCount]);

  return { state, start, pause, resume, stop, getResult };
}
