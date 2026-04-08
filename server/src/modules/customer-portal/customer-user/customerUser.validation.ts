import { z } from 'zod';

export const inviteMemberSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  roleId: z.string().min(1),
});

export const updateMemberSchema = z.object({
  roleId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateMeSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
