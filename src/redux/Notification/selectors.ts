import { RootState } from 'redux/store';
import { Notification } from 'interface/Notifications/notification.interface';

export const getNotifications = (state: RootState): Notification[] =>
  state.notifications.notifications;
