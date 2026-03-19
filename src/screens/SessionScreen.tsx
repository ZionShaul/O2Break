import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { BREATHING_PROGRAMS } from '../data/programs';
import { SessionResult } from '../types';
import { useBreathingSession } from '../hooks/useBreathingSession';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';
import { useHaptics } from '../hooks/useHaptics';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useVoiceGuide } from '../hooks/useVoiceGuide';
import { useLanguage, t } from '../contexts/LanguageContext';
import { BreathingCircle } from '../components/session/BreathingCircle';
import { SessionTimer } from '../components/session/SessionTimer';
import { CycleCounter } from '../components/session/CycleCounter';
import { SessionControls } from '../components/session/SessionControls';
import { BodyFactDisplay } from '../components/session/BodyFactDisplay';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

interface Props {
  programId: string;
  musicId: string;
  onComplete: (result: SessionResult) => void;
  onExit: () => void;
}

export default function SessionScreen({ programId, musicId, onComplete, onExit }: Props) {
  const { lang } = useLanguage();
  const program = BREATHING_PROGRAMS.find(p => p.id === programId)!;
  const { state, start, pause, resume, stop, getResult } = useBreathingSession(program);
  const { scaleAnim, glowOpacity } = useBreathingAnimation(state, program);
  const { triggerPhase } = useHaptics();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak } = useVoiceGuide(voiceEnabled, lang);

  // Background music
  useBackgroundMusic(musicId === 'silence' ? null : musicId);

  const prevPhaseIndex = useRef(state.currentPhaseIndex);

  // Keep screen awake during session
  useEffect(() => {
    activateKeepAwakeAsync().catch(() => {});
    return () => { deactivateKeepAwake(); };
  }, []);

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(() => start(), 800);
    return () => clearTimeout(timer);
  }, []);

  // Haptic + voice on phase change
  useEffect(() => {
    if (prevPhaseIndex.current !== state.currentPhaseIndex) {
      triggerPhase(state.currentPhase);
      speak(state.currentPhase);
      prevPhaseIndex.current = state.currentPhaseIndex;
    }
  }, [state.currentPhaseIndex, state.currentPhase, triggerPhase, speak]);

  // Handle completion
  useEffect(() => {
    if (state.status === 'complete') {
      const timer = setTimeout(() => {
        onComplete(getResult());
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const currentPhase = program.phases[state.currentPhaseIndex];
  const progress = state.elapsedMs / state.totalDurationMs;

  return (
    <LinearGradient
      colors={program.gradient}
      style={styles.container}
    >
      <StatusBar hidden />

      {/* Ambient background tint from accent color */}
      <View
        style={[
          styles.ambientTint,
          { backgroundColor: program.accentColor },
        ]}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onExit} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.topCenter}>
            <Text style={styles.programName} numberOfLines={1}>
              {t(lang, program.nameHe, program.nameEn)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setVoiceEnabled(v => !v)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={voiceEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
              size={22}
              color={voiceEnabled ? Colors.textSecondary : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Main breathing area */}
        <View style={styles.breathArea}>
          <BreathingCircle
            scaleAnim={scaleAnim}
            glowOpacity={glowOpacity}
            accentColor={program.accentColor}
            phaseLabel={currentPhase.labelEn}
            phaseHe={currentPhase.labelHe}
          />
        </View>

        {/* Body facts — rotating every 30 seconds */}
        <BodyFactDisplay
          program={program}
          elapsedMs={state.elapsedMs}
        />

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, progress * 100)}%`,
                  backgroundColor: program.accentColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <CycleCounter count={state.cycleCount} />
          <SessionTimer elapsedMs={state.elapsedMs} totalMs={state.totalDurationMs} />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <SessionControls
            status={state.status}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={stop}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.s6,
    paddingTop: Layout.s4,
    paddingBottom: Layout.s2,
  },
  topCenter: {
    alignItems: 'center',
  },
  programName: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  breathArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    paddingHorizontal: Layout.s10,
    marginBottom: Layout.s5,
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.white10,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    borderRadius: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Layout.s8,
    marginBottom: Layout.s8,
  },
  controls: {
    paddingBottom: Layout.s10,
    alignItems: 'center',
  },
});
