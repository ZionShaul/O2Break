import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { DayStat } from '../types/stats';
import { format, parseISO } from 'date-fns';
import { COLORS } from '../utils/theme';

interface Props {
  days: DayStat[];
  barColor?: string;
}

const CHART_HEIGHT = 120;
const BAR_WIDTH = 28;
const GAP = 12;

export function StatsBarChart({ days, barColor = COLORS.primary }: Props) {
  const maxCount = Math.max(...days.map((d) => d.sessionCount), 1);
  const totalWidth = days.length * (BAR_WIDTH + GAP) - GAP;

  return (
    <View style={styles.container}>
      <Svg width={totalWidth} height={CHART_HEIGHT}>
        {days.map((day, i) => {
          const barH = Math.max((day.sessionCount / maxCount) * (CHART_HEIGHT - 20), day.sessionCount > 0 ? 4 : 0);
          const x = i * (BAR_WIDTH + GAP);
          const y = CHART_HEIGHT - 20 - barH;
          return (
            <Rect
              key={day.date}
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barH}
              rx={6}
              fill={barColor}
              opacity={day.sessionCount > 0 ? 1 : 0.15}
            />
          );
        })}
      </Svg>
      <View style={[styles.labels, { width: totalWidth }]}>
        {days.map((day) => (
          <Text key={day.date} style={styles.label}>
            {format(parseISO(day.date), 'EEE')}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {
    width: BAR_WIDTH,
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
