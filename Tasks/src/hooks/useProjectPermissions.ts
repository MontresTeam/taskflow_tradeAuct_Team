import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectsApi } from '../lib/api';
import { TASK_FLOW_PERMISSIONS } from '@shared/constants/permissions';
import { usePermissions } from './usePermissions';
import { userHasPermission } from '../utils/permissions';

const PROJECT_FULL_ACCESS = [
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.CREATE,
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.READ,
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.UPDATE,
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.DELETE,
];

function hasProjectFullAccess(perms: string[]): boolean {
  if (perms.some((p) => p.endsWith('.*') && 'project.project.create'.startsWith(p.slice(0, -1)))) return true;
  if (PROJECT_FULL_ACCESS.every((p) => perms.includes(p))) return true;
  // Legacy role fallback: project.project.create is the sole indicator of global project admin
  if (perms.includes(TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.CREATE)) return true;
  return false;
}

export function useProjectPermissions(projectId: string | undefined) {
  const { token } = useAuth();
  const { permissions: globalPerms } = usePermissions();
  const [memberPerms, setMemberPerms] = useState<string[]>([]);

  const load = useCallback(async () => {
    if (!projectId || !token) {
      setMemberPerms([]);
      return;
    }
    const res = await projectsApi.getMyPermissions(projectId, token);
    if (res.success && res.data?.permissions) setMemberPerms(res.data.permissions);
    else setMemberPerms([]);
  }, [projectId, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const hasGlobalOverride = hasProjectFullAccess(globalPerms);
  const can = (...perms: string[]): boolean => {
    if (hasGlobalOverride) return true;
    return perms.every((p) => userHasPermission(memberPerms, p));
  };
  return { can, hasGlobalOverride, memberPerms, reload: load };
}
