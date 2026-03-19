import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BREATHING_PROGRAMS } from '../data/programs';
import { SessionResult } from '../types';
import { saveSession } from '../utils/storage';
import { useLanguage, t } from '../contexts/LanguageContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

const { width } = Dimensions.get('window');

const CONFETTI_COUNT = 20;

interface Props {
  result: SessionResult;
  onHome: () => void;
  onRepeat: () => void;
}

function msToReadable(ms: number, lang: 'he' | 'en'): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  if (lang === 'he') {
    if (m === 0) return `${s} שניות`;
    if (s === 0) return `${m} דקות`;
    return `${m}:${s.toString().padStart(2, '0')} דקות`;
  } else {
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m} min`;
    return `${m}:${s.toString().padStart(2, '0')} min`;
  }
}

export default function SessionCompleteScreen({ result, onHome, onRepeat }: Props) {
  const { lang } = useLanguage();
  const program = BREATHING_PROGRAMS.find(p => p.id === result.programId)!;

  const mainOpacity = useRef(new Animated.Value(0)).current;
  const mainScale = useRef(new Animated.Value(0.9)).current;

  const confetti = useRef(
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-20),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: [program.accentColor, Colors.success, Colors.warning, Colors.textAccent][i % 4],
      size: 6 + Math.random() * 8,
      delay: i * 60,
    }))
  ).current;

  useEffect(() => {
    // Auto-save session
    saveSession({
      id: Date.now().toString(),
      programNameHe: program.nameHe,
      programNameEn: program.nameEn,
      ...result,
    }).catch(() => {});

    // Main content entrance
    Animated.parallel([
      Animated.timing(mainOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(mainScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
    ]).start();

    // Confetti
    confetti.forEach(p => {
      const targetY = 300 + Math.random() * 400;
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(p.y, { toValue: targetY, duration: 2000, useNativeDriver: true }),
          Animated.timing(p.opacity, { toValue: 0, duration: 2000, delay: 800, useNativeDriver: true }),
          Animated.timing(p.rotate, { toValue: 720, duration: 2000, useNativeDriver: true }),
        ]),
      ]).start();
    });
  }, []);

  const breathsPerMin = result.durationMs > 0
    ? ((result.cycleCount / (result.durationMs / 60000)).toFixed(1))
    : '0';

  const handleShare = () => {
    const mins = Math.floor(result.durationMs / 60000);
    const secs = Math.floor((result.durationMs % 60000) / 1000);
    const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;

    const message = lang === 'he'
      ? `🌬️ השלמתי הפסקת נשימה!\n\nתוכנית: ${program.nameHe}\nמשך: ${timeStr} דקות\nמחזורים: ${result.cycleCount}\n\nO2Break — נשימה מודעת`
      : `🌬️ I completed a breathing break!\n\nProgram: ${program.nameEn}\nDuration: ${timeStr} min\nCycles: ${result.cycleCount}\n\nO2Break — Conscious Breathing`;

    Share.share({ message });
  };

  return (
    <LinearGradient colors={['#080C12', '#0E1520', '#080C12']} style={styles.container}>
      <StatusBar style="light" />

      {/* Confetti */}
      {confetti.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left: p.x,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: [
                { translateY: p.y },
                { rotate: p.rotate.interpolate({ inputRange: [0, 720], outputRange: ['0deg', '720deg'] }) },
              ],
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.content,
            { opacity: mainOpacity, transform: [{ scale: mainScale }] },
          ]}
        >
          {/* Icon */}
          <View style={[styles.iconCircle, { borderColor: program.accentColor }]}>
            <Text style={[styles.iconEmoji]}>✓</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {t(lang, 'ההפסקה הושלמה! 🌬️', 'Break Complete! 🌬️')}
          </Text>

          {/* Program name */}
          <Text style={[styles.programName, { color: program.accentColor }]}>
            {t(lang, program.nameHe, program.nameEn)}
          </Text>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{msToReadable(result.durationMs, lang)}</Text>
              <Text style={styles.statLabel}>{t(lang, 'משך', 'Duration')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{result.cycleCount}</Text>
              <Text style={styles.statLabel}>{t(lang, 'מחזורים', 'Cycles')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{breathsPerMin}</Text>
              <Text style={styles.statLabel}>{t(lang, 'נשימות/דקה', 'breaths/min')}</Text>
            </View>
          </View>

          {/* Message */}
          <Text style={styles.message}>
            {t(
              lang,
              'כל נשימה מודעת היא מתנה לעצמך.\nהגוף והנפש שלך קיבלו מה שהם צריכים.',
              'Every conscious breath is a gift to yourself.\nYour body and mind received what they needed.'
            )}
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttons, { opacity: mainOpacity }]}>
          <TouchableOpacity onPress={onRepeat} style={styles.repeatBtn} activeOpacity={0.8}>
            <LinearGradient
              colors={[program.accentColor + '44', program.accentColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.repeatGradient}
            >
              <Text style={styles.repeatText}>
                {t(lang, 'הפסקה נוספת', 'Another Break')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.shareBtnText}>{t(lang, 'שתף', 'Share')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onHome} style={styles.homeBtn} activeOpacity={0.7}>
              <Text style={styles.homeText}>{t(lang, 'חזור לבית', 'Home')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.s8,
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Layout.s8,
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.s6,
    backgroundColor: Colors.white05,
  },
  iconEmoji: {
    fontSize: 36,
    color: Colors.white,
  },
  title: {
    fontSize: Typography.xl2,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Layout.s5,
    textAlign: 'center',
  },
  programName: {
    fontSize: Typography.md,
    fontWeight: '500',
    marginBottom: Layout.s8,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white05,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.s5,
    marginBottom: Layout.s6,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Layout.s1,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: Layout.s4,
  },
  message: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Layout.s4,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: Layout.s6,
    gap: Layout.s4,
  },
  repeatBtn: {
    borderRadius: Layout.radiusFull,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  repeatGradient: {
    paddingVertical: Layout.s5,
    alignItems: 'center',
  },
  repeatText: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Layout.s8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.s2,
    paddingVertical: Layout.s4,
    paddingHorizontal: Layout.s4,
  },
  shareBtnText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  homeBtn: {
    paddingVertical: Layout.s4,
    paddingHorizontal: Layout.s4,
  },
  homeText: {
    fontSize: Typography.base,
    color: Colors.textMuted,
  },
});
