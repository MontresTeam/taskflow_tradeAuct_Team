import { CustomerProjectMapping } from './customerProjectMapping.model';
import { ApiError } from '../../../utils/ApiError';

export async function listMappings(orgId: string): Promise<unknown[]> {
  return CustomerProjectMapping.find({ customerOrgId: orgId })
    .populate('projectId', 'name key description')
    .populate('mappedBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();
}

export async function addMapping(
  orgId: string,
  projectId: string,
  mappedBy: string,
  allowedRequestTypes?: string[]
): Promise<unknown> {
  const existing = await CustomerProjectMapping.findOne({
    customerOrgId: orgId,
    projectId,
  }).lean();

  if (existing) throw new ApiError(409, 'This project is already mapped to the organisation');

  const mapping = await CustomerProjectMapping.create({
    customerOrgId: orgId,
    projectId,
    mappedBy,
    allowedRequestTypes: allowedRequestTypes ?? ['bug', 'feature', 'suggestion', 'concern', 'other'],
    status: 'active',
  });

  const populated = await CustomerProjectMapping.findById(mapping._id)
    .populate('projectId', 'name key description')
    .populate('mappedBy', 'name email')
    .lean();

  return populated;
}

export async function removeMapping(orgId: string, projectId: string): Promise<void> {
  const mapping = await CustomerProjectMapping.findOne({
    customerOrgId: orgId,
    projectId,
  }).lean();

  if (!mapping) throw new ApiError(404, 'Mapping not found');
  await CustomerProjectMapping.findByIdAndDelete(mapping._id);
}

export async function updateMapping(
  orgId: string,
  projectId: string,
  input: { allowedRequestTypes?: string[]; status?: 'active' | 'inactive' }
): Promise<unknown> {
  const mapping = await CustomerProjectMapping.findOne({
    customerOrgId: orgId,
    projectId,
  }).lean();

  if (!mapping) throw new ApiError(404, 'Mapping not found');

  const update: Record<string, unknown> = {};
  if (input.allowedRequestTypes !== undefined) update.allowedRequestTypes = input.allowedRequestTypes;
  if (input.status !== undefined) update.status = input.status;

  const updated = await CustomerProjectMapping.findByIdAndUpdate(
    mapping._id,
    { $set: update },
    { new: true }
  )
    .populate('projectId', 'name key description')
    .populate('mappedBy', 'name email')
    .lean();

  if (!updated) throw new ApiError(404, 'Mapping not found');
  return updated;
}
