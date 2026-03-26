import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Reminder } from '../types/reminder';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('breathing-reminders', {
      name: 'Breathing Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedule notifications for a reminder (one per selected day, or daily if days=[])
export async function scheduleReminderNotifications(reminder: Reminder): Promise<string[]> {
  const ids: string[] = [];
  const daysToSchedule = reminder.days.length > 0 ? reminder.days : [0, 1, 2, 3, 4, 5, 6];

  for (const day of daysToSchedule) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌬️ O2Break',
        body: reminder.label || 'Time for a breathing break!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day + 1, // expo uses 1=Sun...7=Sat
        hour: reminder.hour,
        minute: reminder.minute,
      },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelReminderNotifications(notificationIds: string[]): Promise<void> {
  await Promise.all(notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
