import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IntensityLevel } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

const LABELS: Record<IntensityLevel, { en: string; he: string }> = {
  gentle: { en: 'Gentle', he: 'עדין' },
  medium: { en: 'Medium', he: 'בינוני' },
  intense: { en: 'Intense', he: 'אינטנסיבי' },
};

const BG: Record<IntensityLevel, string> = {
  gentle: Colors.gentleBg,
  medium: Colors.mediumBg,
  intense: Colors.intenseBg,
};

const FG: Record<IntensityLevel, string> = {
  gentle: Colors.gentleFg,
  medium: Colors.mediumFg,
  intense: Colors.intenseFg,
};

interface Props {
  intensity: IntensityLevel;
}

export function ProgramBadge({ intensity }: Props) {
  const label = LABELS[intensity];
  return (
    <View style={[styles.badge, { backgroundColor: BG[intensity] }]}>
      <Text style={[styles.text, { color: FG[intensity] }]}>
        {label.he} · {label.en}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Layout.s3,
    paddingVertical: 3,
    borderRadius: Layout.radiusFull,
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
