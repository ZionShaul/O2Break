import { useState, useCallback } from 'react';
import { format, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { StoredSession } from '../types';
import { DayStat, WeekStat } from '../types/stats';
import { loadSessions } from '../utils/storage';

export function useSessionStorage() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);

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
        const d = format(new Date(s.completedAt), 'yyyy-MM-dd');
        return d === dateStr;
      });
      return {
        date: dateStr,
        sessionCount: daySessions.length,
        totalDurationSeconds: daySessions.reduce((sum, s) => sum + Math.round(s.durationMs / 1000), 0),
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
      (s) => format(new Date(s.completedAt), 'yyyy-MM-dd') === today
    );
    return {
      count: todaySessions.length,
      totalDurationSeconds: todaySessions.reduce((sum, s) => sum + Math.round(s.durationMs / 1000), 0),
    };
  }

  function getAllTimeStats() {
    const programCounts: Record<string, { count: number; nameHe: string; nameEn: string }> = {};
    sessions.forEach((s) => {
      if (!programCounts[s.programId]) {
        programCounts[s.programId] = { count: 0, nameHe: s.programNameHe, nameEn: s.programNameEn };
      }
      programCounts[s.programId].count++;
    });
    const topEntry = Object.entries(programCounts).sort((a, b) => b[1].count - a[1].count)[0];

    return {
      totalSessions: sessions.length,
      totalDurationSeconds: sessions.reduce((sum, s) => sum + Math.round(s.durationMs / 1000), 0),
      topProgramId: topEntry?.[0] ?? null,
      topProgramNameHe: topEntry?.[1].nameHe ?? null,
      topProgramNameEn: topEntry?.[1].nameEn ?? null,
    };
  }

  return { sessions, load, getWeekStats, getTodayStats, getAllTimeStats };
}
