import { MusicOption } from '../types';

export const MUSIC_OPTIONS: MusicOption[] = [
  {
    id: 'silence',
    nameHe: 'שקט',
    nameEn: 'Silence',
    emoji: '🔇',
    source: null,
  },
  {
    id: 'ocean',
    nameHe: 'גלי ים',
    nameEn: 'Ocean Waves',
    emoji: '🌊',
    source: require('../../assets/audio/ocean.mp3'),
  },
  {
    id: 'rain',
    nameHe: 'גשם',
    nameEn: 'Rain',
    emoji: '🌧️',
    source: require('../../assets/audio/rain.mp3'),
  },
  {
    id: 'forest',
    nameHe: 'יער',
    nameEn: 'Forest',
    emoji: '🌲',
    source: require('../../assets/audio/forest.mp3'),
  },
  {
    id: 'bowls',
    nameHe: 'קערות טיבטיות',
    nameEn: 'Tibetan Bowls',
    emoji: '🎵',
    source: require('../../assets/audio/bowls.mp3'),
  },
  {
    id: 'binaural',
    nameHe: 'ביטים בינאוריים',
    nameEn: 'Binaural Beats',
    emoji: '🎧',
    source: require('../../assets/audio/binaural.mp3'),
  },
];
