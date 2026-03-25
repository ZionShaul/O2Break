import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/types';
import { getPatternById } from '../utils/breathingPatterns';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { useSession } from '../context/SessionContext';
import { useSpotify } from '../context/SpotifyContext';
import { BreathingCircle } from '../components/BreathingCircle';
import { PhaseLabel } from '../components/PhaseLabel';
import { SpotifyMiniPlayer } from '../components/SpotifyMiniPlayer';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { play, pause } from '../utils/spotifyApi';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Breathing'>;
  route: RouteProp<HomeStackParamList, 'Breathing'>;
};

export function BreathingScreen({ navigation, route }: Props) {
  const { patternId, rounds } = route.params;
  const pattern = getPatternById(patternId);
  const { completeSession } = useSession();
  const { isConnected, isEnabled, playbackState, token } = useSpotify();

  const showSpotify = isConnected && isEnabled && playbackState;

  const handleComplete = useCallback(
    async (durationSeconds: number, roundsCompleted: number) => {
      await completeSession({
        id: String(Date.now()),
        patternId,
        startedAt: Date.now() - durationSeconds * 1000,
        durationSeconds,
        roundsCompleted,
        wasCompleted: true,
      });
    },
    [completeSession, patternId]
  );

  const { status, currentPhase, phaseProgress, phaseSecondsLeft, roundsCompleted, start, pause: togglePause, stop } =
    useBreathingTimer(pattern!, rounds, handleComplete);

  // Start session and Spotify on mount
  useEffect(() => {
    start();
    if (isConnected && isEnabled && token) {
      play(token.accessToken).catch(() => {});
    }
    return () => {
      if (isConnected && isEnabled && token) {
        pause(token.accessToken).catch(() => {});
      }
    };
  }, []);

  // Navigate away when done
  useEffect(() => {
    if (status === 'done') {
      setTimeout(() => navigation.goBack(), 1500);
    }
  }, [status, navigation]);

  if (!pattern) return null;

  const handleStop = () => {
    stop();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: pattern.color + '15' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleStop} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.patternName}>{pattern.name}</Text>
        <Text style={styles.roundsInfo}>
          {roundsCompleted}/{rounds}
        </Text>
      </View>

      <View style={styles.circleArea}>
        {status === 'done' ? (
          <View style={styles.doneContainer}>
            <Text style={styles.doneEmoji}>✅</Text>
            <Text style={styles.doneText}>כל הכבוד!</Text>
          </View>
        ) : (
          <>
            <BreathingCircle
              phase={currentPhase}
              progress={phaseProgress}
              pattern={pattern}
              size={220}
            />
            <PhaseLabel phase={currentPhase} secondsLeft={phaseSecondsLeft} />
          </>
        )}
      </View>

      {status !== 'done' && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.pauseBtn, { borderColor: pattern.color }]}
            onPress={togglePause}
          >
            <Text style={[styles.pauseText, { color: pattern.color }]}>
              {status === 'paused' ? '▶ המשך' : '⏸ עצור'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showSpotify && token && (
        <View style={styles.playerContainer}>
          <SpotifyMiniPlayer playbackState={playbackState!} accessToken={token.accessToken} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  roundsInfo: {
    fontSize: 16,
    color: COLORS.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
  circleArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  doneContainer: {
    alignItems: 'center',
  },
  doneEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  doneText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  controls: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  pauseBtn: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },
  pauseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});
