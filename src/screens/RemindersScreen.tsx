import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReminders } from '../hooks/useReminders';
import { ReminderItem } from '../components/ReminderItem';
import { requestNotificationPermissions } from '../utils/notifications';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

export function RemindersScreen() {
  const { reminders, load, addReminder, toggleReminder, deleteReminder } = useReminders();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTime, setPickerTime] = useState(new Date());

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert('הרשאה נדרשת', 'אנא אפשר התראות בהגדרות המכשיר');
      return;
    }
    setPickerTime(new Date());
    setShowPicker(true);
  };

  const handlePickerChange = (_: unknown, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (date) {
        setPickerTime(date);
        // On Android, confirm immediately after selection
        addReminder({
          hour: date.getHours(),
          minute: date.getMinutes(),
          days: [],
          label: 'הפסקת נשימה',
        });
      }
    } else if (date) {
      setPickerTime(date);
    }
  };

  const handleConfirm = async () => {
    setShowPicker(false);
    await addReminder({
      hour: pickerTime.getHours(),
      minute: pickerTime.getMinutes(),
      days: [],
      label: 'הפסקת נשימה',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>תזכורות</Text>
        <Text style={styles.subtitle}>קבל תזכורות יומיות לתרגיל נשימה</Text>

        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>אין תזכורות עדיין</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {reminders.map((r) => (
              <ReminderItem
                key={r.id}
                reminder={r}
                onToggle={() => toggleReminder(r.id)}
                onDelete={() => deleteReminder(r.id)}
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>+ הוסף תזכורת</Text>
        </TouchableOpacity>
      </ScrollView>

      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>בחר שעה</Text>
              <DateTimePicker
                value={pickerTime}
                mode="time"
                display="spinner"
                onChange={handlePickerChange}
                locale="he"
              />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmText}>אשר</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={pickerTime}
          mode="time"
          display="clock"
          onChange={handlePickerChange}
          onTouchCancel={() => setShowPicker(false)}
        />
      )}

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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  list: {
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  addBtn: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0007',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
