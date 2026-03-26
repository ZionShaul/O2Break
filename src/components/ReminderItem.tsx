import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Reminder } from '../types/reminder';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const DAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

interface Props {
  reminder: Reminder;
  onToggle: () => void;
  onDelete: () => void;
}

export function ReminderItem({ reminder, onToggle, onDelete }: Props) {
  const timeStr = `${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')}`;
  const dayStr =
    reminder.days.length === 0
      ? 'כל יום'
      : reminder.days.map((d) => DAY_LABELS[d]).join(' ');

  return (
    <View style={[styles.container, !reminder.enabled && styles.disabled]}>
      <View style={styles.left}>
        <Text style={styles.time}>{timeStr}</Text>
        <Text style={styles.meta}>
          {dayStr} · {reminder.label}
        </Text>
      </View>
      <View style={styles.right}>
        <Switch
          value={reminder.enabled}
          onValueChange={onToggle}
          trackColor={{ true: COLORS.primary }}
          thumbColor={COLORS.white}
        />
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  left: {
    flex: 1,
  },
  time: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.text,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
  deleteText: {
    fontSize: 18,
  },
});
