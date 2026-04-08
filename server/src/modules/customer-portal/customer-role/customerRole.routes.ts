import { Router } from 'express';
import { customerAuthMiddleware } from '../middleware/customerAuth.middleware';
import { customerRequirePermission } from '../middleware/customerRequirePermission';
import * as customerRoleController from './customerRole.controller';

const router = Router();

router.use(customerAuthMiddleware);

router.get('/', ...customerRoleController.listRoles);
router.post('/', customerRequirePermission('roles:manage'), ...customerRoleController.createRole);
router.patch('/:roleId', customerRequirePermission('roles:manage'), ...customerRoleController.updateRole);
router.delete('/:roleId', customerRequirePermission('roles:manage'), ...customerRoleController.deleteRole);

export const customerRoleRoutes = router;
