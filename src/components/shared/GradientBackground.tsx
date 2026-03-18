import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  colors: [string, string, string];
  children: React.ReactNode;
}

export function GradientBackground({ colors, children }: Props) {
  return (
    <LinearGradient colors={colors} style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
