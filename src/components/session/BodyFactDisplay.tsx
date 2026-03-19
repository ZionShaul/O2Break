import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { BreathingProgram } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

const FACT_INTERVAL_MS = 30000; // rotate every 30 seconds

interface Props {
  program: BreathingProgram;
  elapsedMs: number;
}

export function BodyFactDisplay({ program, elapsedMs }: Props) {
  const facts = program.bodyFacts;
  if (!facts || facts.length === 0) return null;

  const targetIndex = Math.floor(elapsedMs / FACT_INTERVAL_MS) % facts.length;
  const [displayedIndex, setDisplayedIndex] = useState(targetIndex);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (targetIndex !== displayedIndex) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setDisplayedIndex(targetIndex);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [targetIndex]);

  const fact = facts[displayedIndex];
  if (!fact) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={[styles.textHe, { color: program.accentColor }]}>
        {fact.textHe}
      </Text>
      <Text style={styles.textEn}>{fact.textEn}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Layout.s8,
    paddingVertical: Layout.s3,
    minHeight: 52,
    justifyContent: 'center',
  },
  textHe: {
    fontSize: Typography.sm,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 3,
  },
  textEn: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
