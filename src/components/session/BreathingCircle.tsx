import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Layout } from '../../constants/layout';
import { Typography } from '../../constants/typography';
import { Lang } from '../../types';

interface Props {
  scaleAnim: Animated.Value;
  glowOpacity: Animated.Value;
  accentColor: string;
  phaseLabel: string;
  phaseHe: string;
  lang: Lang;
}

export function BreathingCircle({
  scaleAnim,
  glowOpacity,
  accentColor,
  phaseLabel,
  phaseHe,
  lang,
}: Props) {
  const size = Layout.circleSize;

  return (
    <View style={styles.container}>
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: (size * 1.4) / 2,
            backgroundColor: accentColor,
            opacity: Animated.multiply(glowOpacity, 0.3),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Middle glow ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.15,
            height: size * 1.15,
            borderRadius: (size * 1.15) / 2,
            backgroundColor: accentColor,
            opacity: Animated.multiply(glowOpacity, 0.2),
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Main circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: accentColor,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.phaseText, { color: accentColor }]}>
          {lang === 'he' ? phaseHe : phaseLabel}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.circleSize * 2,
    height: Layout.circleSize * 2,
  },
  glow: {
    position: 'absolute',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: Typography.xl2,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
