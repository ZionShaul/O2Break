import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { BREATHING_PROGRAMS } from '../data/programs';
import { BackButton } from '../components/shared/BackButton';
import { ProgramBadge } from '../components/programs/ProgramBadge';
import { MusicSelector } from '../components/programs/MusicSelector';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

interface Props {
  programId: string;
  onStart: (id: string, musicId: string) => void;
  onBack: () => void;
}

export default function ProgramDetailScreen({ programId, onStart, onBack }: Props) {
  const program = BREATHING_PROGRAMS.find(p => p.id === programId)!;
  const [selectedMusicId, setSelectedMusicId] = useState('silence');

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(contentTranslate, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalCycleSecs = program.phases.reduce((s, p) => s + p.durationMs / 1000, 0);

  return (
    <LinearGradient colors={program.gradient} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={onBack} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Animated.View
            style={{
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            }}
          >
            {/* Glow circle */}
            <View style={[styles.glowOrb, { backgroundColor: program.accentColor }]} />

            {/* Program name */}
            <View style={styles.nameBlock}>
              <Text style={styles.nameHe}>{program.nameHe}</Text>
              <Text style={styles.nameEn}>{program.nameEn}</Text>
              <Text style={styles.origin}>{program.origin}</Text>
            </View>

            {/* Badges row */}
            <View style={styles.badgeRow}>
              <ProgramBadge intensity={program.intensity} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{program.defaultDurationMinutes} דקות</Text>
              </View>
            </View>

            {/* Tagline */}
            <View style={styles.taglineBlock}>
              <Text style={styles.taglineHe}>{program.taglineHe}</Text>
              <Text style={styles.taglineEn}>{program.taglineEn}</Text>
            </View>

            {/* Breath rhythm visualizer */}
            <View style={styles.rhythmBlock}>
              <Text style={styles.rhythmTitle}>קצב הנשימה / Breath Rhythm</Text>
              <View style={styles.rhythmVisual}>
                {program.phases.map((phase, i) => {
                  const maxDuration = Math.max(...program.phases.map(p => p.durationMs));
                  const flex = phase.durationMs / maxDuration;
                  const isInhale = phase.label === 'inhale';
                  return (
                    <React.Fragment key={i}>
                      <View
                        style={[
                          styles.rhythmBar,
                          {
                            flex,
                            backgroundColor: isInhale
                              ? program.accentColor
                              : 'rgba(255,255,255,0.15)',
                          },
                        ]}
                      >
                        <Text style={styles.rhythmLabel}>{phase.labelHe}</Text>
                        <Text style={styles.rhythmSecs}>{phase.durationMs / 1000}s</Text>
                      </View>
                      {i < program.phases.length - 1 && <View style={styles.rhythmGap} />}
                    </React.Fragment>
                  );
                })}
              </View>
              <Text style={styles.rhythmCycle}>מחזור: {totalCycleSecs} שניות · Cycle: {totalCycleSecs}s</Text>
            </View>

            {/* Music selector */}
            <MusicSelector
              selectedId={selectedMusicId}
              accentColor={program.accentColor}
              onChange={setSelectedMusicId}
            />

            {/* Description */}
            <View style={styles.descBlock}>
              <Text style={styles.descHe}>{program.descriptionHe}</Text>
              <View style={styles.descDivider} />
              <Text style={styles.descEn}>{program.descriptionEn}</Text>
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              * לא מומלץ בהריון, עם בעיות לב, אפילפסיה, או תחת השפעת חומרים.
              התייעץ עם רופא לפני השימוש.
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Start button */}
        <View style={styles.startArea}>
          <TouchableOpacity
            onPress={() => onStart(program.id, selectedMusicId)}
            style={styles.startButton}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[program.accentColor + '33', program.accentColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startGradient}
            >
              <Text style={styles.startText}>התחל הפסקה</Text>
              <Text style={styles.startTextEn}>Start Break</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Layout.s6,
    paddingTop: Layout.s4,
    paddingBottom: Layout.s2,
  },
  scroll: {
    paddingHorizontal: Layout.s6,
    paddingBottom: Layout.s8,
  },
  glowOrb: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    opacity: 0.12,
    position: 'absolute',
    top: -40,
    zIndex: 0,
  },
  nameBlock: {
    alignItems: 'center',
    paddingTop: Layout.s8,
    paddingBottom: Layout.s5,
  },
  nameHe: {
    fontSize: Typography.xl2,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.s2,
  },
  nameEn: {
    fontSize: Typography.lg,
    fontWeight: '300',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: Layout.s2,
  },
  origin: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.s3,
    marginBottom: Layout.s6,
  },
  durationBadge: {
    paddingHorizontal: Layout.s3,
    paddingVertical: 3,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.white10,
  },
  durationText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  taglineBlock: {
    alignItems: 'center',
    marginBottom: Layout.s6,
  },
  taglineHe: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Layout.s1,
  },
  taglineEn: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rhythmBlock: {
    backgroundColor: Colors.white05,
    borderRadius: Layout.radiusMd,
    padding: Layout.s5,
    marginBottom: Layout.s5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rhythmTitle: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Layout.s4,
  },
  rhythmVisual: {
    flexDirection: 'row',
    height: 60,
    borderRadius: Layout.radiusSm,
    overflow: 'hidden',
  },
  rhythmBar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.radiusSm,
  },
  rhythmLabel: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  rhythmSecs: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  rhythmGap: {
    width: 4,
  },
  rhythmCycle: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.s3,
  },
  descBlock: {
    backgroundColor: Colors.white05,
    borderRadius: Layout.radiusMd,
    padding: Layout.s5,
    marginBottom: Layout.s5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descHe: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: Layout.s4,
  },
  descDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Layout.s4,
  },
  descEn: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Layout.s4,
    marginBottom: Layout.s4,
  },
  startArea: {
    paddingHorizontal: Layout.s6,
    paddingBottom: Layout.s6,
    paddingTop: Layout.s3,
  },
  startButton: {
    borderRadius: Layout.radiusFull,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startGradient: {
    paddingVertical: Layout.s5,
    alignItems: 'center',
  },
  startText: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  startTextEn: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
