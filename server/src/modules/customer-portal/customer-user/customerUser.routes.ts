import { Router } from 'express';
import { customerAuthMiddleware } from '../middleware/customerAuth.middleware';
import { customerRequirePermission } from '../middleware/customerRequirePermission';
import * as customerUserController from './customerUser.controller';

const router = Router();

router.use(customerAuthMiddleware);

// Own profile endpoints
router.get('/me', ...customerUserController.getMe);
router.patch('/me', ...customerUserController.updateMe);
router.patch('/me/password', ...customerUserController.changePassword);

// Team management endpoints
router.get(
  '/',
  customerRequirePermission('team:view'),
  ...customerUserController.listMembers
);

router.post(
  '/',
  customerRequirePermission('team:invite'),
  ...customerUserController.inviteMember
);

router.get(
  '/:userId',
  customerRequirePermission('team:view'),
  ...customerUserController.getMember
);

router.patch(
  '/:userId',
  customerRequirePermission('team:manage'),
  ...customerUserController.updateMember
);

router.delete(
  '/:userId',
  customerRequirePermission('team:manage'),
  ...customerUserController.removeMember
);

export const customerUserRoutes = router;
