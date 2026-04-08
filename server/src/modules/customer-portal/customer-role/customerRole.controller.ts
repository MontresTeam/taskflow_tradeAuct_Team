import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../../middleware/validate';
import { createRoleSchema, updateRoleSchema } from './customerRole.validation';
import * as customerRoleService from './customerRole.service';

async function listRolesHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerRoleService.listRoles(orgId);
  res.status(200).json({ success: true, data: { roles: result } });
}

async function createRoleHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerRoleService.createRole(orgId, req.body);
  res.status(201).json({ success: true, data: result });
}

async function updateRoleHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerRoleService.updateRole(orgId, req.params.roleId, req.body);
  res.status(200).json({ success: true, data: result });
}

async function deleteRoleHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  await customerRoleService.deleteRole(orgId, req.params.roleId);
  res.status(200).json({ success: true, data: { message: 'Role deleted' } });
}

export const listRoles = [asyncHandler(listRolesHandler)];
export const createRole = [validate(createRoleSchema, 'body'), asyncHandler(createRoleHandler)];
export const updateRole = [validate(updateRoleSchema, 'body'), asyncHandler(updateRoleHandler)];
export const deleteRole = [asyncHandler(deleteRoleHandler)];
