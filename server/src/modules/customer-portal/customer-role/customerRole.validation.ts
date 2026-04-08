import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1).max(80).trim(),
  permissions: z.array(z.string()).default([]),
  isDefault: z.boolean().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1).max(80).trim().optional(),
  permissions: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
