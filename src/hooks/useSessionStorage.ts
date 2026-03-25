import { useState, useCallback } from 'react';
import { format, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { BreathingSession } from '../types/breathing';
import { DayStat, WeekStat } from '../types/stats';
import { loadSessions } from '../utils/storage';

export function useSessionStorage() {
  const [sessions, setSessions] = useState<BreathingSession[]>([]);

  const load = useCallback(async () => {
    const data = await loadSessions();
    setSessions(data);
  }, []);

  function getWeekStats(weekStart: Date): WeekStat {
    const start = startOfWeek(weekStart, { weekStartsOn: 0 });
    const end = endOfWeek(weekStart, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const dayStats: DayStat[] = days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const daySessions = sessions.filter((s) => {
        const d = format(new Date(s.startedAt), 'yyyy-MM-dd');
        return d === dateStr;
      });
      return {
        date: dateStr,
        sessionCount: daySessions.length,
        totalDurationSeconds: daySessions.reduce((sum, s) => sum + s.durationSeconds, 0),
      };
    });

    return {
      weekStart: format(start, 'yyyy-MM-dd'),
      days: dayStats,
      totalSessions: dayStats.reduce((s, d) => s + d.sessionCount, 0),
      totalDurationSeconds: dayStats.reduce((s, d) => s + d.totalDurationSeconds, 0),
    };
  }

  function getTodayStats() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySessions = sessions.filter(
      (s) => format(new Date(s.startedAt), 'yyyy-MM-dd') === today
    );
    return {
      count: todaySessions.length,
      totalDurationSeconds: todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0),
    };
  }

  function getAllTimeStats() {
    const patternCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      patternCounts[s.patternId] = (patternCounts[s.patternId] ?? 0) + 1;
    });
    const topPattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      totalSessions: sessions.length,
      totalDurationSeconds: sessions.reduce((sum, s) => sum + s.durationSeconds, 0),
      topPatternId: topPattern,
    };
  }

  return { sessions, load, getWeekStats, getTodayStats, getAllTimeStats };
}
