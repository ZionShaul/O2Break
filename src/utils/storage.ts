import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredSession } from '../types';
import { Reminder } from '../types/reminder';
import { SpotifyToken } from '../types/spotify';

// ─── Storage Keys ──────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  SESSIONS: 'sessions_v1',
  REMINDERS: '@o2break/reminders',
  SPOTIFY_TOKEN: '@o2break/spotify_token',
  SPOTIFY_ENABLED: '@o2break/spotify_enabled',
  SETTINGS: '@o2break/settings',
} as const;

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function saveSession(session: StoredSession): Promise<void> {
  const existing = await loadSessions();
  const updated = [session, ...existing];
  await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
}

export async function loadSessions(): Promise<StoredSession[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSession[];
    // Restore Date objects (JSON serializes them as strings)
    return parsed.map(s => ({ ...s, completedAt: new Date(s.completedAt) }));
  } catch {
    return [];
  }
}

export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
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

// ─── Reminders ────────────────────────────────────────────────────────────────

export async function loadReminders(): Promise<Reminder[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
}

// ─── Spotify ──────────────────────────────────────────────────────────────────

export async function loadSpotifyToken(): Promise<SpotifyToken | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SPOTIFY_TOKEN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveSpotifyToken(token: SpotifyToken): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SPOTIFY_TOKEN, JSON.stringify(token));
}

export async function clearSpotifyToken(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SPOTIFY_TOKEN);
}

export async function loadSpotifyEnabled(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SPOTIFY_ENABLED);
    return raw === 'true';
  } catch {
    return false;
  }
}

export async function saveSpotifyEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SPOTIFY_ENABLED, String(enabled));
}
