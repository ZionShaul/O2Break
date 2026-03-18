import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SessionState, BreathingProgram } from '../types';
import { Layout } from '../constants/layout';

export function useBreathingAnimation(state: SessionState, program: BreathingProgram) {
  const scaleAnim = useRef(new Animated.Value(Layout.circleMinScale)).current;
  const glowOpacity = useRef(new Animated.Value(0.25)).current;
  const runningAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (runningAnimRef.current) {
      runningAnimRef.current.stop();
      runningAnimRef.current = null;
    }

    if (state.status !== 'running') return;

    const phase = program.phases[state.currentPhaseIndex];
    const duration = phase.durationMs;

    let targetScale: number;
    let targetGlow: number;

    if (phase.label === 'inhale') {
      targetScale = Layout.circleMaxScale;
      targetGlow = 0.85;
    } else if (phase.label === 'exhale') {
      targetScale = Layout.circleMinScale;
      targetGlow = 0.20;
    } else if (phase.label === 'hold-top') {
      targetScale = Layout.circleMaxScale;
      targetGlow = 0.85;
    } else {
      targetScale = Layout.circleMinScale;
      targetGlow = 0.20;
    }

    const anim = Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration,
        easing: Easing.bezier(0.45, 0.0, 0.55, 1.0),
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: targetGlow,
        duration,
        easing: phase.label === 'inhale'
          ? Easing.out(Easing.quad)
          : Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    runningAnimRef.current = anim;
    anim.start();

    return () => {
      anim.stop();
      runningAnimRef.current = null;
    };
  }, [state.currentPhaseIndex, state.status]);

  return { scaleAnim, glowOpacity };
}
