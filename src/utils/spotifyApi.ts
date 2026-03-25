import { PlaybackState, SpotifyToken, SpotifyTrack } from '../types/spotify';

const BASE_URL = 'https://api.spotify.com/v1';

async function spotifyFetch(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
}

export async function getCurrentPlayback(token: string): Promise<PlaybackState | null> {
  try {
    const res = await spotifyFetch('/me/player', token);
    if (res.status === 204 || res.status === 404) return null;
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.item) return null;

    const track: SpotifyTrack = {
      id: data.item.id,
      name: data.item.name,
      artists: data.item.artists.map((a: { name: string }) => a.name),
      albumArt: data.item.album?.images?.[0]?.url ?? '',
      durationMs: data.item.duration_ms,
    };

    return {
      isPlaying: data.is_playing,
      track,
      progressMs: data.progress_ms ?? 0,
    };
  } catch {
    return null;
  }
}

export async function play(token: string): Promise<void> {
  await spotifyFetch('/me/player/play', token, { method: 'PUT' });
}

export async function pause(token: string): Promise<void> {
  await spotifyFetch('/me/player/pause', token, { method: 'PUT' });
}

export async function nextTrack(token: string): Promise<void> {
  await spotifyFetch('/me/player/next', token, { method: 'POST' });
}

export async function refreshAccessToken(
  clientId: string,
  refreshToken: string
): Promise<SpotifyToken | null> {
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }).toString(),
    });

    if (!res.ok) return null;
    const data = await res.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
  } catch {
    return null;
  }
}
