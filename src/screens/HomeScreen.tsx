import React, { useEffect, useRef } from 'react';
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
}

export default function HomeScreen({ onStart }: Props) {
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
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      ]),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Logo pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Particles
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

        {/* Logo area */}
        <View style={styles.logoArea}>
          <Animated.View
            style={[
              styles.logoOuter,
              {
                opacity: logoOpacity,
                transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
              },
            ]}
          >
            <LinearGradient
              colors={['#1A3A5C', '#0D2137']}
              style={styles.logoGradient}
            >
              <View style={styles.logoInner}>
                <Text style={styles.logoO}>O</Text>
                <Text style={styles.logo2}>2</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.Text style={[styles.appName, { opacity: titleOpacity }]}>
            O2Break
          </Animated.Text>

          <Animated.Text style={[styles.taglineEn, { opacity: subtitleOpacity }]}>
            Conscious Breathing
          </Animated.Text>
          <Animated.Text style={[styles.taglineHe, { opacity: subtitleOpacity }]}>
            נשימה מודעת
          </Animated.Text>
        </View>

        {/* CTA */}
        <Animated.View style={[styles.ctaArea, { opacity: ctaOpacity }]}>
          <Text style={styles.description}>
            כל הפסקה היא הזדמנות לנשום
          </Text>
          <Text style={styles.descriptionEn}>
            5–7 minutes · Choose your program
          </Text>

          <TouchableOpacity onPress={onStart} style={styles.ctaButton} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1A3A5C', '#4FC3F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>התחל הפסקה</Text>
              <Text style={styles.ctaTextEn}>Start Break</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.s12,
  },
  particle: {
    position: 'absolute',
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
  logoInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoO: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.white,
    letterSpacing: -2,
  },
  logo2: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4FC3F7',
    marginTop: 6,
  },
  appName: {
    fontSize: Typography.xl2,
    fontWeight: '200',
    color: Colors.textPrimary,
    letterSpacing: Typography.wider_ls,
    textTransform: 'uppercase',
    marginBottom: Layout.s3,
  },
  taglineEn: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    letterSpacing: Typography.wide_ls,
    textTransform: 'uppercase',
    marginBottom: Layout.s2,
  },
  taglineHe: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  ctaArea: {
    width: '100%',
    paddingHorizontal: Layout.s8,
    alignItems: 'center',
  },
  description: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.s2,
  },
  descriptionEn: {
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
  ctaTextEn: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
