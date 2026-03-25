export interface Reminder {
  id: string;
  hour: number;
  minute: number;
  days: number[]; // 0=Sun...6=Sat, empty = every day
  label: string;
  enabled: boolean;
  notificationIds: string[];
}
