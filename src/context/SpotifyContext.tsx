import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SpotifyToken, PlaybackState } from '../types/spotify';
import {
  loadSpotifyToken,
  saveSpotifyToken,
  clearSpotifyToken,
  loadSpotifyEnabled,
  saveSpotifyEnabled,
} from '../utils/storage';
import { getCurrentPlayback, refreshAccessToken } from '../utils/spotifyApi';
import Constants from 'expo-constants';

const SPOTIFY_CLIENT_ID: string = Constants.expoConfig?.extra?.spotifyClientId ?? '';

interface SpotifyContextValue {
  isConnected: boolean;
  isEnabled: boolean;
  playbackState: PlaybackState | null;
  token: SpotifyToken | null;
  setToken: (token: SpotifyToken | null) => void;
  disconnect: () => Promise<void>;
  toggleEnabled: () => Promise<void>;
  refreshPlayback: () => Promise<void>;
}

const SpotifyContext = createContext<SpotifyContextValue>({
  isConnected: false,
  isEnabled: false,
  playbackState: null,
  token: null,
  setToken: () => {},
  disconnect: async () => {},
  toggleEnabled: async () => {},
  refreshPlayback: async () => {},
});

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<SpotifyToken | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      const [storedToken, enabled] = await Promise.all([
        loadSpotifyToken(),
        loadSpotifyEnabled(),
      ]);
      setTokenState(storedToken);
      setIsEnabled(enabled);
    })();
  }, []);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!token) return null;
    if (Date.now() < token.expiresAt - 60000) return token.accessToken;

    // Refresh
    const refreshed = await refreshAccessToken(SPOTIFY_CLIENT_ID, token.refreshToken);
    if (!refreshed) return null;
    setTokenState(refreshed);
    await saveSpotifyToken(refreshed);
    return refreshed.accessToken;
  }, [token]);

  const refreshPlayback = useCallback(async () => {
    const accessToken = await getValidToken();
    if (!accessToken) return;
    const state = await getCurrentPlayback(accessToken);
    setPlaybackState(state);
  }, [getValidToken]);

  // Poll playback every 5s when connected and enabled
  useEffect(() => {
    if (token && isEnabled) {
      refreshPlayback();
      pollRef.current = setInterval(refreshPlayback, 5000);
    } else {
      setPlaybackState(null);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, isEnabled, refreshPlayback]);

  const setToken = useCallback(async (t: SpotifyToken | null) => {
    setTokenState(t);
    if (t) await saveSpotifyToken(t);
    else await clearSpotifyToken();
  }, []);

  const disconnect = useCallback(async () => {
    setTokenState(null);
    setPlaybackState(null);
    await clearSpotifyToken();
  }, []);

  const toggleEnabled = useCallback(async () => {
    const next = !isEnabled;
    setIsEnabled(next);
    await saveSpotifyEnabled(next);
  }, [isEnabled]);

  return (
    <SpotifyContext.Provider
      value={{
        isConnected: !!token,
        isEnabled,
        playbackState,
        token,
        setToken,
        disconnect,
        toggleEnabled,
        refreshPlayback,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  return useContext(SpotifyContext);
}
