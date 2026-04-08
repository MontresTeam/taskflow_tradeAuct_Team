import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/requirePermission';
import {
  getUsers,
  getUserById,
  updateUserHandler,
  updatePermissionOverridesHandler,
  inviteUserHandler,
  userIdParamHandler,
} from './users.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { TASK_FLOW_PERMISSIONS } from '../../shared/constants/permissions';

const router = Router();

router.use(authMiddleware);

router.get('/', requirePermission(TASK_FLOW_PERMISSIONS.AUTH.USER.LIST), asyncHandler(getUsers));
router.get('/:id', ...userIdParamHandler, asyncHandler(getUserById));
router.post('/invite', requirePermission(TASK_FLOW_PERMISSIONS.AUTH.USER.CREATE), ...inviteUserHandler);
router.patch('/:id', requirePermission(TASK_FLOW_PERMISSIONS.AUTH.USER.UPDATE), updateUserHandler);
router.patch(
  '/:id/permissions',
  requirePermission(TASK_FLOW_PERMISSIONS.AUTH.USER.UPDATE),
  ...updatePermissionOverridesHandler
);

export const usersRoutes = router;
