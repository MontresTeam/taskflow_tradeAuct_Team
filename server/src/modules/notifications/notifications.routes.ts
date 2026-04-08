import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/requirePermission';
import { asyncHandler } from '../../utils/asyncHandler';
import { TASK_FLOW_PERMISSIONS } from '../../shared/constants/permissions';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  getUnreadCount,
  deleteNotification,
} from './notifications.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.LIST), asyncHandler(listNotifications));
router.get(
  '/unread-count',
  requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.READ),
  asyncHandler(getUnreadCount)
);
router.patch(
  '/:id/read',
  requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.MARK_READ),
  asyncHandler(markNotificationRead)
);
router.post(
  '/read-all',
  requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.MARK_ALL_READ),
  asyncHandler(markAllNotificationsRead)
);
router.patch(
  '/read-all',
  requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.MARK_ALL_READ),
  asyncHandler(markAllNotificationsRead)
);
router.delete(
  '/:id',
  requirePermission(TASK_FLOW_PERMISSIONS.INBOX.NOTIFICATION.DELETE),
  asyncHandler(deleteNotification)
);

export const notificationsRoutes = router;

