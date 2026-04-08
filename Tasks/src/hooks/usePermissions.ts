import { useAuth } from '../contexts/AuthContext';
import { userHasPermission } from '../utils/permissions';

export function usePermissions() {
  const { user } = useAuth();
  const permissions = user?.permissions ?? [];
  const can = (...perms: string[]): boolean => perms.every((p) => userHasPermission(permissions, p));
  const canAny = (...perms: string[]): boolean => perms.some((p) => userHasPermission(permissions, p));
  return { can, canAny, permissions };
}
