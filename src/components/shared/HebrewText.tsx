import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

interface Props {
  children: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

export function HebrewText({ children, style, numberOfLines }: Props) {
  return (
    <Text
      style={[styles.base, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
