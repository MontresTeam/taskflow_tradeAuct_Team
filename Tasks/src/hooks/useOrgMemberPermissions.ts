import { useAuth } from '../contexts/AuthContext';
import { userHasPermission } from '../utils/permissions';

/** Customer portal org-scoped permissions from JWT payload. */
export function useOrgMemberPermissions() {
  const { user } = useAuth();
  const memberPerms = user?.userType === 'customer' ? user.customerPermissions ?? [] : [];
  const can = (...perms: string[]): boolean => perms.every((p) => userHasPermission(memberPerms, p));
  const canAny = (...perms: string[]): boolean => perms.some((p) => userHasPermission(memberPerms, p));
  return { can, canAny, memberPerms };
}
