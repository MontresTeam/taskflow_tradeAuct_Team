import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requirePermission } from '../../../middleware/requirePermission';
import * as customerOrgController from './customerOrg.controller';
import * as customerProjectMappingController from '../customer-project-mapping/customerProjectMapping.controller';
import { TASK_FLOW_PERMISSIONS } from '../../../shared/constants/permissions';

const router = Router();

router.use(authMiddleware);
router.use(requirePermission(TASK_FLOW_PERMISSIONS.TASKFLOW.CUSTOMER_PORTAL.ORG_MANAGE));

router.get('/', ...customerOrgController.listOrgs);
router.post('/', ...customerOrgController.createOrg);
router.get('/:id', ...customerOrgController.getOrg);
router.patch('/:id', ...customerOrgController.updateOrg);
router.delete('/:id', ...customerOrgController.deleteOrg);
router.get('/:id/roles', ...customerOrgController.listOrgRoles);
router.get('/:id/members', ...customerOrgController.listOrgMembers);
router.patch('/:id/members/:userId', ...customerOrgController.updateOrgMember);
router.patch('/:id/members/:userId/permissions', ...customerOrgController.updateOrgMemberPermissions);

// Project mappings for this org
router.get('/:orgId/projects', ...customerProjectMappingController.listMappingsAdmin);
router.post('/:orgId/projects', ...customerProjectMappingController.addMapping);
router.patch('/:orgId/projects/:projectId', ...customerProjectMappingController.updateMapping);
router.delete('/:orgId/projects/:projectId', ...customerProjectMappingController.removeMapping);

export const customerOrgRoutes = router;
