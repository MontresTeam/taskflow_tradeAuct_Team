import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/requirePermission';
import { customerAuthMiddleware } from '../middleware/customerAuth.middleware';
import { customerRequirePermission } from '../middleware/customerRequirePermission';
import * as customerProjectMappingController from './customerProjectMapping.controller';
import { TASK_FLOW_PERMISSIONS } from '../../../shared/constants/permissions';

const router = Router();

// Portal read-only route: GET /customer/projects
router.get(
  '/',
  customerAuthMiddleware,
  customerRequirePermission('projects:view'),
  ...customerProjectMappingController.listMappingsPortal
);

// TF Admin routes under /admin/customer-orgs/:orgId/mappings
// These are mounted separately but we also support them here for the org-scoped admin routes
router.get(
  '/admin/:orgId',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.ORG_MANAGE),
  ...customerProjectMappingController.listMappingsAdmin
);

router.post(
  '/admin/:orgId',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.ORG_MANAGE),
  ...customerProjectMappingController.addMapping
);

router.patch(
  '/admin/:orgId/:projectId',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.ORG_MANAGE),
  ...customerProjectMappingController.updateMapping
);

router.delete(
  '/admin/:orgId/:projectId',
  authMiddleware,
  requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.ORG_MANAGE),
  ...customerProjectMappingController.removeMapping
);

export const customerProjectMappingRoutes = router;
