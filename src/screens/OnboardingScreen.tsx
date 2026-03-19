import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useLanguage, t } from '../contexts/LanguageContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🌬️',
    titleHe: 'ברוך הבא ל-O2Break',
    titleEn: 'Welcome to O2Break',
    bodyHe: 'כל הפסקה היא הזדמנות לנשום.\n5-7 דקות של נשימה מודעת שמשנות את היום.',
    bodyEn: 'Every break is a chance to breathe.\n5-7 minutes of conscious breathing that changes your day.',
  },
  {
    emoji: '🎵',
    titleHe: 'איך זה עובד?',
    titleEn: 'How it works',
    bodyHe: '1. בחר תוכנית נשימה\n2. בחר מוזיקת רקע\n3. עצום עיניים ונשום — הקול ינחה אותך',
    bodyEn: '1. Choose a breathing program\n2. Choose background music\n3. Close your eyes — voice guidance leads you',
  },
  {
    emoji: '✨',
    titleHe: 'מה הגוף מרוויח?',
    titleEn: 'What your body gains',
    bodyHe: '✓ מוריד לחץ תוך דקות\n✓ מגביר ריכוז ואנרגיה\n✓ מפעיל את מנגנון הרגיעה הטבעי',
    bodyEn: '✓ Reduces stress within minutes\n✓ Boosts focus and energy\n✓ Activates your natural calm response',
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goTo(currentIndex + 1);
    } else {
      onDone();
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <LinearGradient colors={['#080C12', '#0E1520', '#080C12']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        {/* Skip */}
        <TouchableOpacity style={styles.skip} onPress={onDone}>
          <Text style={styles.skipText}>{t(lang, 'דלג', 'Skip')}</Text>
        </TouchableOpacity>

        {/* Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.slideContainer}
        >
          {SLIDES.map((slide, i) => (
            <View key={i} style={[styles.slide, { width }]}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
              <Text style={styles.title}>
                {t(lang, slide.titleHe, slide.titleEn)}
              </Text>
              <Text style={styles.body}>
                {t(lang, slide.bodyHe, slide.bodyEn)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, i === currentIndex && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Next / Done button */}
        <View style={styles.btnArea}>
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1A3A5C', '#4FC3F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextGradient}
            >
              <Text style={styles.nextText}>
                {isLast
                  ? t(lang, 'בוא נתחיל!', "Let's start!")
                  : t(lang, 'הבא', 'Next')}
              </Text>
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
  skip: {
    alignSelf: 'flex-end',
    paddingHorizontal: Layout.s6,
    paddingTop: Layout.s4,
    paddingBottom: Layout.s2,
  },
  skipText: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  slideContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.s8,
  },
  emoji: {
    fontSize: 72,
    marginBottom: Layout.s8,
  },
  title: {
    fontSize: Typography.xl2,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Layout.s5,
  },
  body: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.s3,
    marginBottom: Layout.s8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white10,
  },
  dotActive: {
    backgroundColor: '#4FC3F7',
    width: 20,
  },
  btnArea: {
    paddingHorizontal: Layout.s8,
    paddingBottom: Layout.s10,
  },
  nextBtn: {
    borderRadius: Layout.radiusFull,
    overflow: 'hidden',
    elevation: 6,
  },
  nextGradient: {
    paddingVertical: Layout.s5,
    alignItems: 'center',
  },
  nextText: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.white,
  },
});
