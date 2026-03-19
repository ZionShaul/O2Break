import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { StoredSession } from '../types';
import { loadSessions, calcStreak, totalSessionMinutes } from '../utils/storage';
import { BackButton } from '../components/shared/BackButton';
import { useLanguage, t } from '../contexts/LanguageContext';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Layout } from '../constants/layout';

interface Props {
  onBack: () => void;
}

function formatDuration(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(date: Date, lang: 'he' | 'en'): string {
  const d = new Date(date);
  if (lang === 'he') {
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryScreen({ onBack }: Props) {
  const { lang } = useLanguage();
  const [sessions, setSessions] = useState<StoredSession[]>([]);

  useEffect(() => {
    loadSessions().then(setSessions);
  }, []);

  const streak = calcStreak(sessions);
  const totalMins = totalSessionMinutes(sessions);

  const renderItem = ({ item }: { item: StoredSession }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemProgram}>
          {lang === 'he' ? item.programNameHe : item.programNameEn}
        </Text>
        <Text style={styles.itemDate}>{formatDate(item.completedAt, lang)}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemDuration}>{formatDuration(item.durationMs)}</Text>
        <Text style={styles.itemCycles}>
          {item.cycleCount} {t(lang, 'מחזורים', 'cycles')}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#080C12', '#0E1520', '#080C12']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>
            {t(lang, 'היסטוריה', 'History')}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Summary cards */}
        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{streak > 0 ? `🔥 ${streak}` : '—'}</Text>
            <Text style={styles.summaryLabel}>{t(lang, 'ימים ברצף', 'Day streak')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{sessions.length}</Text>
            <Text style={styles.summaryLabel}>{t(lang, 'הפסקות', 'Sessions')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalMins}</Text>
            <Text style={styles.summaryLabel}>{t(lang, "דקות נשימה", 'Min. breathing')}</Text>
          </View>
        </View>

        {/* Session list */}
        {sessions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌬️</Text>
            <Text style={styles.emptyText}>
              {t(lang, 'עוד לא סיימת הפסקה.\nהתחל את הראשונה!', 'No sessions yet.\nStart your first one!')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.s6,
    paddingTop: Layout.s4,
    paddingBottom: Layout.s4,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summary: {
    flexDirection: 'row',
    marginHorizontal: Layout.s6,
    marginBottom: Layout.s6,
    backgroundColor: Colors.white05,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.s5,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  list: {
    paddingHorizontal: Layout.s6,
    paddingBottom: Layout.s8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.s4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemLeft: {
    flex: 1,
  },
  itemProgram: {
    fontSize: Typography.base,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  itemDate: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemDuration: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: '#4FC3F7',
    marginBottom: 2,
  },
  itemCycles: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.s8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Layout.s5,
  },
  emptyText: {
    fontSize: Typography.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
