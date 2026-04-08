import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../../middleware/validate';
import {
  inviteMemberSchema,
  updateMemberSchema,
  updateMeSchema,
  changePasswordSchema,
} from './customerUser.validation';
import * as customerUserService from './customerUser.service';

async function listMembersHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerUserService.listMembers(orgId);
  res.status(200).json({ success: true, data: { members: result } });
}

async function inviteMemberHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerUserService.inviteMember(orgId, req.body, req.customerUser!.id);
  res.status(201).json({ success: true, data: result });
}

async function getMemberHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerUserService.getMember(orgId, req.params.userId);
  res.status(200).json({ success: true, data: result });
}

async function updateMemberHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  const result = await customerUserService.updateMember(orgId, req.params.userId, req.body);
  res.status(200).json({ success: true, data: result });
}

async function removeMemberHandler(req: Request, res: Response): Promise<void> {
  const orgId = req.customerUser!.orgId;
  await customerUserService.removeMember(orgId, req.params.userId);
  res.status(200).json({ success: true, data: { message: 'Member removed' } });
}

async function getMeHandler(req: Request, res: Response): Promise<void> {
  const result = await customerUserService.getMe(req.customerUser!.id);
  res.status(200).json({ success: true, data: result });
}

async function updateMeHandler(req: Request, res: Response): Promise<void> {
  const result = await customerUserService.updateMe(req.customerUser!.id, req.body);
  res.status(200).json({ success: true, data: result });
}

async function changePasswordHandler(req: Request, res: Response): Promise<void> {
  await customerUserService.changePassword(
    req.customerUser!.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  res.status(200).json({ success: true, data: { message: 'Password changed' } });
}

export const listMembers = [asyncHandler(listMembersHandler)];
export const inviteMember = [validate(inviteMemberSchema, 'body'), asyncHandler(inviteMemberHandler)];
export const getMember = [asyncHandler(getMemberHandler)];
export const updateMember = [validate(updateMemberSchema, 'body'), asyncHandler(updateMemberHandler)];
export const removeMember = [asyncHandler(removeMemberHandler)];
export const getMe = [asyncHandler(getMeHandler)];
export const updateMe = [validate(updateMeSchema, 'body'), asyncHandler(updateMeHandler)];
export const changePassword = [validate(changePasswordSchema, 'body'), asyncHandler(changePasswordHandler)];
