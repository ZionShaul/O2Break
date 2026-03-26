export interface DayStat {
  date: string; // 'YYYY-MM-DD'
  sessionCount: number;
  totalDurationSeconds: number;
}

export interface WeekStat {
  weekStart: string; // 'YYYY-MM-DD' Monday
  days: DayStat[];
  totalSessions: number;
  totalDurationSeconds: number;
}
