import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BreathingPattern } from '../types/breathing';
import { getPatternTotalSeconds } from '../utils/breathingPatterns';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

interface Props {
  pattern: BreathingPattern;
  selected: boolean;
  onPress: () => void;
}

export function PatternCard({ pattern, selected, onPress }: Props) {
  const cycleSec = getPatternTotalSeconds(pattern);

  return (
    <TouchableOpacity
      style={[styles.card, selected && { borderColor: pattern.color, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.dot, { backgroundColor: pattern.color }]} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{pattern.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{pattern.description}</Text>
        <Text style={styles.cycle}>{cycleSec}s per cycle</Text>
      </View>
      {selected && <Text style={[styles.check, { color: pattern.color }]}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  cycle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  check: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
});
