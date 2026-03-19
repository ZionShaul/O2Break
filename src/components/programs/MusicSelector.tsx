import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MUSIC_OPTIONS } from '../../data/musicOptions';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

interface Props {
  selectedId: string;
  accentColor: string;
  onChange: (id: string) => void;
}

export function MusicSelector({ selectedId, accentColor, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>מוזיקת רקע · Background Music</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {MUSIC_OPTIONS.map(opt => {
          const isSelected = opt.id === selectedId;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[
                styles.option,
                isSelected && {
                  borderColor: accentColor,
                  backgroundColor: accentColor + '22',
                },
              ]}
              activeOpacity={0.75}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <Text style={[styles.nameHe, isSelected && { color: accentColor }]}>
                {opt.nameHe}
              </Text>
              <Text style={styles.nameEn}>{opt.nameEn}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Layout.s5,
  },
  title: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Layout.s3,
  },
  scroll: {
    paddingHorizontal: Layout.s6,
    gap: Layout.s3,
  },
  option: {
    alignItems: 'center',
    paddingVertical: Layout.s3,
    paddingHorizontal: Layout.s4,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white05,
    minWidth: 70,
  },
  emoji: {
    fontSize: 22,
    marginBottom: Layout.s1,
  },
  nameHe: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 1,
  },
  nameEn: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
