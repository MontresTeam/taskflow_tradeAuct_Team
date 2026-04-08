import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationTypeEnum {
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_UPDATED = 'issue_updated',
  ISSUE_COMMENTED = 'issue_commented',
  ISSUE_MENTIONED = 'issue_mentioned',
  ISSUE_CLOSED = 'issue_closed',
  PROJECT_ADDED = 'project_added',
  PROJECT_ROLE_CHANGED = 'project_role_changed',
  ORG_ADDED = 'org_added',
  SYSTEM = 'system',
}

/** Includes legacy values stored before migration */
export type NotificationType =
  | NotificationTypeEnum
  | 'mention'
  | 'watch_comment'
  | 'watch_status'
  | 'watch_field'
  | 'issue_unassigned'
  | 'subtask_change'
  | 'invitation_accepted';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
