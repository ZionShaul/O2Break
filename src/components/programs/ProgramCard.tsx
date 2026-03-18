import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BreathingProgram } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';
import { ProgramBadge } from './ProgramBadge';

interface Props {
  program: BreathingProgram;
  onPress: () => void;
}

export function ProgramCard({ program, onPress }: Props) {
  const cycleSecs = program.phases.reduce((s, p) => s + p.durationMs / 1000, 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <View style={styles.card}>
        {/* Gradient accent strip */}
        <LinearGradient
          colors={program.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.strip}
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.top}>
            <Text style={styles.nameHe} numberOfLines={1}>{program.nameHe}</Text>
            <Text style={styles.nameEn} numberOfLines={1}>{program.nameEn}</Text>
          </View>

          <View style={styles.bottom}>
            <ProgramBadge intensity={program.intensity} />
            <View style={styles.meta}>
              <Text style={styles.metaText}>{program.defaultDurationMinutes} דק׳</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{cycleSecs}s cycle</Text>
            </View>
          </View>
        </View>

        {/* Glow dot */}
        <View style={[styles.glowDot, { backgroundColor: program.accentColor }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Layout.s6,
    marginBottom: Layout.s4,
    borderRadius: Layout.radiusMd,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    height: Layout.programCardHeight,
    backgroundColor: Colors.surface1,
    borderRadius: Layout.radiusMd,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  strip: {
    width: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.s5,
    paddingVertical: Layout.s4,
    justifyContent: 'space-between',
  },
  top: {},
  nameHe: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: 2,
  },
  nameEn: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.s2,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  metaDot: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  glowDot: {
    position: 'absolute',
    right: Layout.s5,
    top: Layout.s4,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
});
