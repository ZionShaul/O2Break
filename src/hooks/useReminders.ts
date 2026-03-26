import { useState, useCallback } from 'react';
import { Reminder } from '../types/reminder';
import { loadReminders, saveReminders } from '../utils/storage';
import {
  scheduleReminderNotifications,
  cancelReminderNotifications,
} from '../utils/notifications';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const load = useCallback(async () => {
    const data = await loadReminders();
    setReminders(data);
  }, []);

  const addReminder = useCallback(
    async (partial: Omit<Reminder, 'id' | 'notificationIds' | 'enabled'>) => {
      const notificationIds = await scheduleReminderNotifications({
        ...partial,
        id: '',
        enabled: true,
        notificationIds: [],
      });

      const newReminder: Reminder = {
        ...partial,
        id: String(Date.now()),
        enabled: true,
        notificationIds,
      };

      const updated = [...reminders, newReminder];
      setReminders(updated);
      await saveReminders(updated);
    },
    [reminders]
  );

  const toggleReminder = useCallback(
    async (id: string) => {
      const updated = await Promise.all(
        reminders.map(async (r) => {
          if (r.id !== id) return r;

          if (r.enabled) {
            await cancelReminderNotifications(r.notificationIds);
            return { ...r, enabled: false, notificationIds: [] };
          } else {
            const notificationIds = await scheduleReminderNotifications(r);
            return { ...r, enabled: true, notificationIds };
          }
        })
      );
      setReminders(updated);
      await saveReminders(updated);
    },
    [reminders]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder?.enabled) {
        await cancelReminderNotifications(reminder.notificationIds);
      }
      const updated = reminders.filter((r) => r.id !== id);
      setReminders(updated);
      await saveReminders(updated);
    },
    [reminders]
  );

  return { reminders, load, addReminder, toggleReminder, deleteReminder };
}
