import { Router } from 'express';
import { customerAuthMiddleware } from '../middleware/customerAuth.middleware';
import { customerRequirePermission } from '../middleware/customerRequirePermission';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/requirePermission';
import * as customerRequestController from './customerRequest.controller';
import { TASK_FLOW_PERMISSIONS } from '../../../shared/constants/permissions';

const router = Router();

// TF Admin routes
router.get(
  '/pending-tf-approval',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.REQUEST_APPROVE),
  ...customerRequestController.listPendingTfApproval
);

router.get(
  '/all-tf',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.REQUEST_APPROVE),
  ...customerRequestController.listAllRequestsTf
);

router.get(
  '/tf/:requestId',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.REQUEST_APPROVE),
  ...customerRequestController.getRequest
);

router.post(
  '/:requestId/tf-approve',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.REQUEST_APPROVE),
  ...customerRequestController.tfApprove
);

router.post(
  '/:requestId/tf-reject',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.REQUEST_APPROVE),
  ...customerRequestController.tfReject
);

// Portal routes (customer auth)
router.get(
  '/',
  customerAuthMiddleware,
  customerRequirePermission('requests:view_own'),
  ...customerRequestController.listRequests
);

router.post(
  '/',
  customerAuthMiddleware,
  customerRequirePermission('requests:create'),
  ...customerRequestController.createRequest
);

router.get(
  '/:requestId',
  customerAuthMiddleware,
  customerRequirePermission('requests:view_own'),
  ...customerRequestController.getRequest
);

router.post(
  '/:requestId/approve',
  customerAuthMiddleware,
  customerRequirePermission('requests:approve'),
  ...customerRequestController.orgAdminApprove
);

router.post(
  '/:requestId/reject',
  customerAuthMiddleware,
  customerRequirePermission('requests:approve'),
  ...customerRequestController.orgAdminReject
);

router.post(
  '/:requestId/comments',
  customerAuthMiddleware,
  customerRequirePermission('requests:view_own'),
  ...customerRequestController.addPortalComment
);

export const customerRequestRoutes = router;
