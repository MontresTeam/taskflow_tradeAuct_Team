import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import * as customerProjectMappingService from './customerProjectMapping.service';

// TF Admin handlers (req.user is set)
async function listMappingsAdminHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.params.orgId;
  const result = await customerProjectMappingService.listMappings(orgId);
  res.status(200).json({ success: true, data: { mappings: result } });
}

async function addMappingHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.params.orgId;
  const { projectId, allowedRequestTypes } = req.body;
  const result = await customerProjectMappingService.addMapping(
    orgId,
    projectId,
    req.user!.id,
    allowedRequestTypes
  );
  res.status(201).json({ success: true, data: result });
}

async function removeMappingHandler(req: Request, res: Response): Promise<void> {
  const { orgId, projectId } = req.params;
  await customerProjectMappingService.removeMapping(orgId, projectId);
  res.status(200).json({ success: true, data: { message: 'Mapping removed' } });
}

async function updateMappingHandler(req: Request, res: Response): Promise<void> {
  const { orgId, projectId } = req.params;
  const result = await customerProjectMappingService.updateMapping(orgId, projectId, req.body);
  res.status(200).json({ success: true, data: result });
}

// Portal handler (req.customerUser is set)
async function listMappingsPortalHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerProjectMappingService.listMappings(orgId);
  res.status(200).json({ success: true, data: { mappings: result } });
}

export const listMappingsAdmin = [asyncHandler(listMappingsAdminHandler)];
export const addMapping = [asyncHandler(addMappingHandler)];
export const removeMapping = [asyncHandler(removeMappingHandler)];
export const updateMapping = [asyncHandler(updateMappingHandler)];
export const listMappingsPortal = [asyncHandler(listMappingsPortalHandler)];
