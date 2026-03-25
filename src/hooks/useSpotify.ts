import { useEffect } from 'react';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { SpotifyToken } from '../types/spotify';
import { useSpotify } from '../context/SpotifyContext';

WebBrowser.maybeCompleteAuthSession();

const SPOTIFY_CLIENT_ID: string = Constants.expoConfig?.extra?.spotifyClientId ?? '';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

export function useSpotifyAuth() {
  const { setToken } = useSpotify();

  const redirectUri = makeRedirectUri({ scheme: 'o2break' });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: SCOPES,
      usePKCE: true,
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCode(code);
    }
  }, [response]);

  const exchangeCode = async (code: string) => {
    if (!request?.codeVerifier) return;

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: SPOTIFY_CLIENT_ID,
        code_verifier: request.codeVerifier,
      }).toString(),
    });

    if (!res.ok) return;
    const data = await res.json();

    const token: SpotifyToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    await setToken(token);
  };

  return {
    connect: () => promptAsync(),
    isReady: !!request,
  };
}
