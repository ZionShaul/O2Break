import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useSpotify } from '../context/SpotifyContext';
import { useSpotifyAuth } from '../hooks/useSpotify';
import Constants from 'expo-constants';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const CLIENT_ID = Constants.expoConfig?.extra?.spotifyClientId ?? '';

export function SettingsScreen() {
  const { isConnected, isEnabled, disconnect, toggleEnabled } = useSpotify();
  const { connect, isReady } = useSpotifyAuth();

  const handleConnect = () => {
    if (!CLIENT_ID) {
      Alert.alert(
        'Spotify לא מוגדר',
        'הוסף את SPOTIFY_CLIENT_ID ב-app.json > extra.spotifyClientId',
        [{ text: 'OK' }]
      );
      return;
    }
    connect();
  };

  const handleDisconnect = () => {
    Alert.alert('ניתוק Spotify', 'האם אתה בטוח?', [
      { text: 'ביטול', style: 'cancel' },
      { text: 'נתק', style: 'destructive', onPress: disconnect },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>הגדרות</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎵 Spotify</Text>

          {!isConnected ? (
            <View style={styles.card}>
              <Text style={styles.cardDesc}>
                חבר את Spotify כדי להשמיע מוזיקה בזמן תרגיל הנשימה
              </Text>
              <Text style={styles.premiumNote}>
                ⚠️ נדרש Spotify Premium לשליטה בהשמעה
              </Text>
              <TouchableOpacity
                style={[styles.connectBtn, !isReady && styles.disabledBtn]}
                onPress={handleConnect}
                disabled={!isReady}
              >
                <Text style={styles.connectText}>🔗 חבר Spotify</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.connectedRow}>
                <View style={styles.connectedDot} />
                <Text style={styles.connectedText}>מחובר ל-Spotify</Text>
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleLabel}>השמע מוזיקה בזמן תרגיל</Text>
                  <Text style={styles.toggleSub}>הפעל Spotify אוטומטית</Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={toggleEnabled}
                  trackColor={{ true: COLORS.spotify }}
                  thumbColor={COLORS.white}
                />
              </View>

              <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
                <Text style={styles.disconnectText}>נתק</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ אודות</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>O2Break — אפליקציית נשימה מודרכת</Text>
            <Text style={styles.aboutVersion}>גרסה 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  premiumNote: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  connectBtn: {
    backgroundColor: COLORS.spotify,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  connectText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  connectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.spotify,
    marginRight: SPACING.sm,
  },
  connectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  toggleSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  disconnectBtn: {
    alignItems: 'center',
  },
  disconnectText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
