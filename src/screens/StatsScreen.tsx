import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { StatsBarChart } from '../components/StatsBarChart';
import { getPatternById } from '../utils/breathingPatterns';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export function StatsScreen() {
  const { load, getWeekStats, getTodayStats, getAllTimeStats } = useSessionStorage();

  useEffect(() => {
    load();
  }, []);

  const weekStats = getWeekStats(new Date());
  const todayStats = getTodayStats();
  const allTime = getAllTimeStats();
  const topPattern = allTime.topPatternId ? getPatternById(allTime.topPatternId) : null;

  const totalMinutes = Math.round(allTime.totalDurationSeconds / 60);
  const todayMinutes = Math.round(todayStats.totalDurationSeconds / 60);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>סטטיסטיקות</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>השבוע</Text>
          <View style={styles.chartContainer}>
            <StatsBarChart days={weekStats.days} />
          </View>
          <Text style={styles.weekSummary}>
            {weekStats.totalSessions} תרגילים · {Math.round(weekStats.totalDurationSeconds / 60)} דקות
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>{todayStats.count}</Text>
            <Text style={styles.statLabel}>היום</Text>
          </View>
          <View style={styles.rowGap} />
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>{todayMinutes}m</Text>
            <Text style={styles.statLabel}>דקות היום</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>{allTime.totalSessions}</Text>
            <Text style={styles.statLabel}>סה"כ תרגילים</Text>
          </View>
          <View style={styles.rowGap} />
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>{totalMinutes}m</Text>
            <Text style={styles.statLabel}>סה"כ דקות</Text>
          </View>
        </View>

        {topPattern && (
          <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: topPattern.color }]}>
            <Text style={styles.cardTitle}>תרגיל מועדף</Text>
            <Text style={styles.topPatternName}>{topPattern.name}</Text>
          </View>
        )}

        {allTime.totalSessions === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌬️</Text>
            <Text style={styles.emptyText}>עדיין אין נתונים{'\n'}התחל את התרגיל הראשון שלך!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  weekSummary: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  rowGap: {
    width: SPACING.sm,
  },
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  topPatternName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
