import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

interface Props {
  elapsedMs: number;
  totalMs: number;
}

function msToMMSS(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const s = (totalSecs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function SessionTimer({ elapsedMs, totalMs }: Props) {
  const remaining = Math.max(0, totalMs - elapsedMs);

  return (
    <View style={styles.container}>
      <Text style={styles.elapsed}>{msToMMSS(elapsedMs)}</Text>
      <Text style={styles.separator}>/</Text>
      <Text style={styles.total}>{msToMMSS(totalMs)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.s2,
  },
  elapsed: {
    fontSize: Typography.lg,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  separator: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
  total: {
    fontSize: Typography.base,
    fontWeight: '300',
    color: Colors.textMuted,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
});
