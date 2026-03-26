import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BreathingPhase } from '../types/breathing';
import { getPhaseName } from '../utils/breathingPatterns';
import { COLORS, SPACING } from '../utils/theme';

interface Props {
  phase: BreathingPhase;
  secondsLeft: number;
}

export function PhaseLabel({ phase, secondsLeft }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 300 });
  }, [phase]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Animated.Text style={styles.phaseName}>{getPhaseName(phase)}</Animated.Text>
      <Animated.Text style={styles.seconds}>{secondsLeft}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  phaseName: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 2,
  },
  seconds: {
    fontSize: 52,
    fontWeight: '200',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
});
