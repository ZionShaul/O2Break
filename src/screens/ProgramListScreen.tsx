import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { BREATHING_PROGRAMS } from '../data/programs';
import { ProgramCard } from '../components/programs/ProgramCard';
import { BackButton } from '../components/shared/BackButton';
import { useLanguage, t } from '../contexts/LanguageContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

interface Props {
  onSelect: (id: string) => void;
  onBack: () => void;
}

export default function ProgramListScreen({ onSelect, onBack }: Props) {
  const { lang } = useLanguage();
  const cardAnims = useRef(
    BREATHING_PROGRAMS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    }))
  ).current;

  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const anims = cardAnims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: i * 80,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 400,
          delay: i * 80,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(80, anims).start();
  }, []);

  return (
    <LinearGradient colors={['#080C12', '#0E1520', '#080C12']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <BackButton onPress={onBack} />
          <View style={styles.headerTitles}>
            <Text style={styles.titleHe}>
              {t(lang, 'בחר תוכנית נשימה', 'Choose Your Breath')}
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </Animated.View>

        {/* Info text */}
        <Animated.Text style={[styles.infoText, { opacity: headerOpacity }]}>
          {t(
            lang,
            'כל התוכניות מבוססות על עקרון הנשימה העגולה המחוברת — ללא הפסקה בין שאיפה לנשיפה',
            'All programs are based on connected circular breathing — no pause between inhale and exhale'
          )}
        </Animated.Text>

        {/* Program list */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {BREATHING_PROGRAMS.map((program, i) => (
            <Animated.View
              key={program.id}
              style={{
                opacity: cardAnims[i].opacity,
                transform: [{ translateY: cardAnims[i].translateY }],
              }}
            >
              <ProgramCard
                program={program}
                onPress={() => onSelect(program.id)}
              />
            </Animated.View>
          ))}
          <View style={{ height: Layout.s8 }} />
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.s6,
    paddingTop: Layout.s4,
    paddingBottom: Layout.s3,
  },
  headerTitles: {
    alignItems: 'center',
  },
  titleEn: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    letterSpacing: Typography.wide_ls,
    textTransform: 'uppercase',
  },
  titleHe: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  infoText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Layout.s8,
    paddingBottom: Layout.s6,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Layout.s2,
  },
});
