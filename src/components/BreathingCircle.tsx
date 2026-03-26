import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { BreathingPhase, BreathingPattern } from '../types/breathing';

interface Props {
  phase: BreathingPhase;
  progress: number;
  pattern: BreathingPattern;
  size?: number;
}

export function BreathingCircle({ phase, pattern, size = 200 }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const phaseDuration = pattern.phases[phase] * 1000;

  useEffect(() => {
    switch (phase) {
      case 'inhale':
        scale.value = withTiming(1.45, {
          duration: phaseDuration,
          easing: Easing.out(Easing.ease),
        });
        opacity.value = withTiming(1, { duration: phaseDuration });
        break;
      case 'exhale':
        scale.value = withTiming(0.75, {
          duration: phaseDuration,
          easing: Easing.in(Easing.ease),
        });
        opacity.value = withTiming(0.6, { duration: phaseDuration });
        break;
      case 'hold1':
      case 'hold2':
        opacity.value = withRepeat(
          withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
        break;
    }
  }, [phase, phaseDuration]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 / scale.value * 0.65 }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.outerCircle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: pattern.color + '30' },
          animStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.innerCircle,
          {
            width: size * 0.65,
            height: size * 0.65,
            borderRadius: (size * 0.65) / 2,
            backgroundColor: pattern.color,
          },
          innerStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
  },
  innerCircle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
