import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { MUSIC_OPTIONS } from '../data/musicOptions';

export function useBackgroundMusic(musicId: string | null) {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const option = MUSIC_OPTIONS.find(m => m.id === musicId);
    if (!option || !option.uri) return;

    let mounted = true;

    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: option.uri as string },
          { shouldPlay: true, isLooping: true, volume: 0.4 }
        );

        if (mounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch {
        // Graceful fallback to silence on any error
      }
    };

    loadAndPlay();

    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [musicId]);
}
