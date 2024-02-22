import { User } from 'interface/user.interface';

export enum NotificationEvents {
  ENQUIRY = 'ENQUIRY',
}

export interface Notification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  isRead: boolean;
  recipient: User;
  notificationEvent: NotificationEvents;
}

export type NewNotification = Omit<
  Notification,
  'id' | 'createdAt' | 'updatedAt'
>;
