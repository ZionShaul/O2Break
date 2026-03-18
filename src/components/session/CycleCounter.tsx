import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

interface Props {
  count: number;
}

export function CycleCounter({ count }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>מחזורים{'\n'}cycles</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  count: {
    fontSize: Typography.xl2,
    fontWeight: '200',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  label: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
