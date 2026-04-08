import { CustomerRole } from './customerRole.model';
import { CustomerUser } from '../customer-user/customerUser.model';
import { ApiError } from '../../../utils/ApiError';
import type { CreateRoleInput, UpdateRoleInput } from './customerRole.validation';

export async function listRoles(orgId: string): Promise<unknown[]> {
  return CustomerRole.find({ customerOrgId: orgId }).sort({ isSystemRole: -1, name: 1 }).lean();
}

export async function createRole(orgId: string, input: CreateRoleInput): Promise<unknown> {
  const existing = await CustomerRole.findOne({ customerOrgId: orgId, name: input.name }).lean();
  if (existing) throw new ApiError(409, 'A role with this name already exists');

  const role = await CustomerRole.create({
    customerOrgId: orgId,
    name: input.name,
    permissions: input.permissions ?? [],
    isDefault: input.isDefault ?? false,
    isSystemRole: false,
  });

  return role.toObject();
}

export async function updateRole(orgId: string, roleId: string, input: UpdateRoleInput): Promise<unknown> {
  const role = await CustomerRole.findOne({ _id: roleId, customerOrgId: orgId }).lean();
  if (!role) throw new ApiError(404, 'Role not found');
  if (role.isSystemRole) throw new ApiError(400, 'Cannot update system roles');

  if (input.name) {
    const existing = await CustomerRole.findOne({
      customerOrgId: orgId,
      name: input.name,
      _id: { $ne: roleId },
    }).lean();
    if (existing) throw new ApiError(409, 'A role with this name already exists');
  }

  const update: Record<string, unknown> = {};
  if (input.name !== undefined) update.name = input.name;
  if (input.permissions !== undefined) update.permissions = input.permissions;
  if (input.isDefault !== undefined) update.isDefault = input.isDefault;

  const updated = await CustomerRole.findByIdAndUpdate(roleId, { $set: update }, { new: true }).lean();
  if (!updated) throw new ApiError(404, 'Role not found');
  return updated;
}

export async function deleteRole(orgId: string, roleId: string): Promise<void> {
  const role = await CustomerRole.findOne({ _id: roleId, customerOrgId: orgId }).lean();
  if (!role) throw new ApiError(404, 'Role not found');
  if (role.isSystemRole) throw new ApiError(400, 'Cannot delete system roles');

  // Find the default Member role to reassign members
  const memberRole = await CustomerRole.findOne({
    customerOrgId: orgId,
    isSystemRole: true,
    name: 'Member',
  }).lean();

  if (!memberRole) throw new ApiError(500, 'Default member role not found');

  // Reassign all users with this role to the Member role
  await CustomerUser.updateMany(
    { customerOrgId: orgId, roleId },
    { $set: { roleId: memberRole._id } }
  );

  await CustomerRole.findByIdAndDelete(roleId);
}
