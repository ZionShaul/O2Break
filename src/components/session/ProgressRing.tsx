import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  trackColor?: string;
}

/**
 * A simple progress arc using two half-circle clips.
 * Works without react-native-svg.
 */
export function ProgressRing({ progress, size, strokeWidth, color, trackColor = 'rgba(255,255,255,0.08)' }: Props) {
  const half = size / 2;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // Right half fills first (0 to 0.5), then left half (0.5 to 1)
  const rightDeg = clampedProgress <= 0.5 ? clampedProgress * 2 * 180 : 180;
  const leftDeg = clampedProgress > 0.5 ? (clampedProgress - 0.5) * 2 * 180 : 0;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {/* Track ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: half,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />

      {/* Right half */}
      <View
        style={[
          styles.halfContainer,
          { width: half, height: size, left: half, overflow: 'hidden' },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: size,
              height: size,
              borderRadius: half,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: `${rightDeg - 180}deg` }],
            },
          ]}
        />
      </View>

      {/* Left half (only visible when > 50%) */}
      {leftDeg > 0 && (
        <View
          style={[
            styles.halfContainer,
            { width: half, height: size, left: 0, overflow: 'hidden' },
          ]}
        >
          <View
            style={[
              styles.halfCircleLeft,
              {
                width: size,
                height: size,
                borderRadius: half,
                borderWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotate: `${leftDeg}deg` }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  halfContainer: {
    position: 'absolute',
    top: 0,
  },
  halfCircle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
  },
  halfCircleLeft: {
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 0,
  },
});
