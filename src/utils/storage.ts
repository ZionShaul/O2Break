import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredSession } from '../types';

const SESSIONS_KEY = 'sessions_v1';

export async function saveSession(session: StoredSession): Promise<void> {
  const existing = await loadSessions();
  const updated = [session, ...existing];
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export async function loadSessions(): Promise<StoredSession[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as StoredSession[];
  // Restore Date objects (JSON serializes them as strings)
  return parsed.map(s => ({ ...s, completedAt: new Date(s.completedAt) }));
}

export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}

/**
 * Returns the number of consecutive days (including today) that have at least one session.
 * Returns 0 if no session today.
 */
export function calcStreak(sessions: StoredSession[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const sessionDays = new Set(sessions.map(s => toDateStr(new Date(s.completedAt))));

  // Must have a session today to have a streak
  if (!sessionDays.has(toDateStr(today))) return 0;

  let streak = 1;
  const check = new Date(today);
  while (true) {
    check.setDate(check.getDate() - 1);
    if (sessionDays.has(toDateStr(check))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function totalSessionMinutes(sessions: StoredSession[]): number {
  return Math.floor(sessions.reduce((sum, s) => sum + s.durationMs, 0) / 60000);
}
