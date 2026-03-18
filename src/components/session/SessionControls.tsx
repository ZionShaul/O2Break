import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SessionStatus } from '../../types';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Layout } from '../../constants/layout';

interface Props {
  status: SessionStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function SessionControls({ status, onStart, onPause, onResume, onStop }: Props) {
  return (
    <View style={styles.container}>
      {/* Stop button */}
      <TouchableOpacity onPress={onStop} style={[styles.btn, styles.stopBtn]} activeOpacity={0.75}>
        <Ionicons name="stop" size={22} color={Colors.textSecondary} />
        <Text style={styles.btnLabel}>עצור</Text>
      </TouchableOpacity>

      {/* Main action */}
      {status === 'idle' && (
        <TouchableOpacity onPress={onStart} style={[styles.btn, styles.primaryBtn]} activeOpacity={0.8}>
          <Ionicons name="play" size={28} color={Colors.white} />
          <Text style={[styles.btnLabel, { color: Colors.white }]}>התחל</Text>
        </TouchableOpacity>
      )}
      {status === 'running' && (
        <TouchableOpacity onPress={onPause} style={[styles.btn, styles.primaryBtn]} activeOpacity={0.8}>
          <Ionicons name="pause" size={28} color={Colors.white} />
          <Text style={[styles.btnLabel, { color: Colors.white }]}>השהה</Text>
        </TouchableOpacity>
      )}
      {status === 'paused' && (
        <TouchableOpacity onPress={onResume} style={[styles.btn, styles.primaryBtn]} activeOpacity={0.8}>
          <Ionicons name="play" size={28} color={Colors.white} />
          <Text style={[styles.btnLabel, { color: Colors.white }]}>המשך</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.s8,
  },
  btn: {
    alignItems: 'center',
    gap: Layout.s1,
  },
  stopBtn: {
    opacity: 0.7,
  },
  primaryBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.white20,
    gap: 0,
  },
  btnLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: Layout.s1,
  },
});
