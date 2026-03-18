import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface Props {
  onPress: () => void;
  color?: string;
}

export function BackButton({ onPress, color = Colors.textPrimary }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
      <Ionicons name="chevron-back" size={28} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
