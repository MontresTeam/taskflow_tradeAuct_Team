import mongoose from 'mongoose';

/**
 * One-time shape migration: toUser/readAt/url/meta -> userId/isRead/link/metadata
 */
export async function migrateNotificationSchemaIfNeeded(): Promise<void> {
  const col = mongoose.connection.collection('notifications');
  const needs = await col.countDocuments({
    $or: [{ userId: { $exists: false } }, { userId: null }],
    toUser: { $exists: true },
  });
  if (needs === 0) return;
  await col.updateMany(
    { $or: [{ userId: { $exists: false } }, { userId: null }], toUser: { $exists: true } },
    [
      {
        $set: {
          userId: '$toUser',
          isRead: { $cond: { if: { $ne: ['$readAt', null] }, then: true, else: false } },
          link: { $ifNull: ['$url', null] },
          metadata: { $ifNull: ['$meta', {}] },
          body: { $ifNull: ['$body', ''] },
        },
      },
    ] as never
  );
  console.log(`[migrate] notifications: updated ${needs} document(s) to userId/isRead/link/metadata shape`);
}
