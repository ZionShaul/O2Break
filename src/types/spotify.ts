export interface SpotifyToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix ms
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumArt: string;
  durationMs: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  track: SpotifyTrack | null;
  progressMs: number;
}
