import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PlaybackState } from '../types/spotify';
import { useSpotify } from '../context/SpotifyContext';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

interface Props {
  playbackState: PlaybackState;
  accessToken: string;
}

export function SpotifyMiniPlayer({ playbackState, accessToken }: Props) {
  const { refreshPlayback } = useSpotify();

  const handleSkip = async () => {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setTimeout(refreshPlayback, 800);
  };

  const { track } = playbackState;
  if (!track) return null;

  return (
    <View style={styles.container}>
      {track.albumArt ? (
        <Image source={{ uri: track.albumArt }} style={styles.art} />
      ) : (
        <View style={[styles.art, styles.artPlaceholder]}>
          <Text>🎵</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.trackName} numberOfLines={1}>{track.name}</Text>
        <Text style={styles.artists} numberOfLines={1}>{track.artists.join(', ')}</Text>
      </View>
      <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
        <Text style={styles.skipIcon}>⏭</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.spotify + '40',
    gap: SPACING.sm,
  },
  art: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
  },
  artPlaceholder: {
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  trackName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  artists: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  skipBtn: {
    padding: SPACING.xs,
  },
  skipIcon: {
    fontSize: 20,
    color: COLORS.spotify,
  },
});
