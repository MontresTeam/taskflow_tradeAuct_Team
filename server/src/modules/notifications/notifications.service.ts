import { Notification } from './notification.model';
import { notifyInAppNotification } from '../../websocket';
import { toAppRelativeUrl } from '../../utils/notificationUrl';

export async function listForUser(params: {
  userId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(Math.max(1, params.limit ?? 30), 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { userId: params.userId };
  if (params.unreadOnly) filter.isRead = false;

  const [data, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function unreadCount(userId: string): Promise<number> {
  return Notification.countDocuments({ userId, isRead: false });
}

export async function markRead(notificationId: string, userId: string) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { isRead: true } },
    { new: true }
  ).lean();
}

export async function markAllRead(userId: string) {
  const res = await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
  return { updated: res.modifiedCount ?? 0 };
}

export async function deleteForUser(notificationId: string, userId: string) {
  return Notification.findOneAndDelete({ _id: notificationId, userId }).lean();
}

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  const normalizedLink = toAppRelativeUrl(params.link);
  const doc = await Notification.create({
    userId: params.userId,
    type: params.type,
    title: params.title,
    body: params.body ?? '',
    isRead: false,
    link: normalizedLink,
    metadata: params.metadata ?? {},
  });
  const payload = doc.toObject();
  notifyInAppNotification(params.userId, payload as unknown as Record<string, unknown>);
  return payload;
}
