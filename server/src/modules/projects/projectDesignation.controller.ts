import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as projectDesignationService from './projectDesignation.service';

export async function listDesignations(req: Request, res: Response): Promise<void> {
  const result = await projectDesignationService.listDesignations(req.params.projectId);
  res.status(200).json({ success: true, data: result });
}

export async function createDesignation(req: Request, res: Response): Promise<void> {
  const result = await projectDesignationService.createDesignation(req.params.projectId, req.body);
  res.status(201).json({ success: true, data: result });
}

export async function updateDesignation(req: Request, res: Response): Promise<void> {
  const result = await projectDesignationService.updateDesignation(req.params.projectId, req.params.id, req.body);
  res.status(200).json({ success: true, data: result });
}

export async function deleteDesignation(req: Request, res: Response): Promise<void> {
  await projectDesignationService.deleteDesignation(req.params.projectId, req.params.id);
  res.status(200).json({ success: true, data: { message: 'Designation deleted' } });
}

export const listDesignationsHandler = [asyncHandler(listDesignations)];
export const createDesignationHandler = [asyncHandler(createDesignation)];
export const updateDesignationHandler = [asyncHandler(updateDesignation)];
export const deleteDesignationHandler = [asyncHandler(deleteDesignation)];
