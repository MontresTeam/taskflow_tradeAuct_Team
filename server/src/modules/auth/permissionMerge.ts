import { DEFAULT_USER_PERMISSIONS } from '../../shared/constants/permissions';
import { mapLegacyProjectOrGlobalPermissions } from '../../shared/constants/legacyPermissionMap';

/** Ensure inbox floor permissions are always present for TaskFlow users. */
export function mergeTaskflowPermissionFloor(perms: string[]): string[] {
  const mapped = mapLegacyProjectOrGlobalPermissions(perms);
  return [...new Set([...DEFAULT_USER_PERMISSIONS, ...mapped])];
}
