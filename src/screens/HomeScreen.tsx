import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, t } from '../contexts/LanguageContext';
import { loadSessions, calcStreak } from '../utils/storage';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 14;

interface Particle {
  x: number;
  size: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  duration: number;
  delay: number;
}

interface Props {
  onStart: () => void;
  onHistory: () => void;
}

export default function HomeScreen({ onStart, onHistory }: Props) {
  const { lang, toggle } = useLanguage();
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: Math.random() * width,
      size: 2 + Math.random() * 4,
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      duration: 3000 + Math.random() * 4000,
      delay: i * 300,
    }))
  ).current;

  useEffect(() => {
    loadSessions().then(sessions => {
      setStreak(calcStreak(sessions));
      setTotalSessions(sessions.length);
    });

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      ]),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    particles.forEach((p) => {
      const animate = () => {
        p.translateY.setValue(0);
        p.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(p.opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
            Animated.timing(p.translateY, { toValue: -(height * 0.4), duration: p.duration, useNativeDriver: true }),
          ]),
          Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => animate());
      };
      setTimeout(animate, p.delay);
    });
  }, []);

  return (
    <LinearGradient colors={['#080C12', '#0E1520', '#080C12']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        {/* Particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: p.x,
                bottom: height * 0.1,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: '#4FC3F7',
                opacity: p.opacity,
                transform: [{ translateY: p.translateY }],
              },
            ]}
          />
        ))}

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onHistory} style={styles.topBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="time-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle} style={styles.langBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.langText}>{lang === 'he' ? 'EN' : 'עב'}</Text>
          </TouchableOpacity>
        </View>

        {/* Logo area */}
        <View style={styles.logoArea}>
          <Animated.View
            style={[
              styles.logoOuter,
              { opacity: logoOpacity, transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }] },
            ]}
          >
            <LinearGradient colors={['#1A3A5C', '#0D2137']} style={styles.logoGradient}>
              <View style={styles.logoInner}>
                <Text style={styles.logoO}>O</Text>
                <Text style={styles.logo2}>2</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.Text style={[styles.appName, { opacity: titleOpacity }]}>
            O2Break
          </Animated.Text>
          <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
            {t(lang, 'נשימה מודעת', 'CONSCIOUS BREATHING')}
          </Animated.Text>

          {streak > 0 && (
            <Animated.View style={[styles.streakRow, { opacity: subtitleOpacity }]}>
              <Text style={styles.streakText}>
                🔥 {streak} {t(lang, 'ימים ברצף', 'day streak')}
              </Text>
              <Text style={styles.streakSep}> · </Text>
              <Text style={styles.streakText}>
                {totalSessions} {t(lang, 'הפסקות', 'sessions')}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: ctaOpacity }]}>
          <Text style={styles.description}>
            {t(lang, 'כל הפסקה היא הזדמנות לנשום', 'Every break is a chance to breathe')}
          </Text>
          <Text style={styles.descriptionSub}>
            {t(lang, '5-7 דקות · בחר תוכנית', '5–7 minutes · Choose a program')}
          </Text>

          <TouchableOpacity onPress={onStart} style={styles.ctaButton} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1A3A5C', '#4FC3F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>{t(lang, 'התחל הפסקה', 'Start Break')}</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingVertical: Layout.s4,
  },
  particle: { position: 'absolute' },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.s6,
    paddingVertical: Layout.s2,
  },
  topBtn: { padding: Layout.s2 },
  langBtn: {
    paddingHorizontal: Layout.s3,
    paddingVertical: Layout.s1,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white05,
  },
  langText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: Layout.s8,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.3)',
  },
  logoInner: { flexDirection: 'row', alignItems: 'flex-start' },
  logoO: { fontSize: 48, fontWeight: '300', color: Colors.white, letterSpacing: -2 },
  logo2: { fontSize: 22, fontWeight: '600', color: '#4FC3F7', marginTop: 6 },
  appName: {
    fontSize: Typography.xl2,
    fontWeight: '200',
    color: Colors.textPrimary,
    letterSpacing: Typography.wider_ls,
    textTransform: 'uppercase',
    marginBottom: Layout.s3,
  },
  tagline: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.wide_ls,
    textTransform: 'uppercase',
    marginBottom: Layout.s4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Layout.s2,
  },
  streakText: { fontSize: Typography.sm, color: Colors.textMuted },
  streakSep: { fontSize: Typography.sm, color: Colors.border },
  ctaArea: {
    width: '100%',
    paddingHorizontal: Layout.s8,
    alignItems: 'center',
    paddingBottom: Layout.s8,
  },
  description: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.s2,
  },
  descriptionSub: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Layout.s8,
  },
  ctaButton: {
    width: '100%',
    borderRadius: Layout.radiusFull,
    overflow: 'hidden',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: Layout.s5,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.white,
  },
});
