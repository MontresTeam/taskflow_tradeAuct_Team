import type { ReactNode } from 'react';
import { useOrgMemberPermissions } from '../hooks/useOrgMemberPermissions';

interface Props {
  permissions: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function OrgPermissionGate({ permissions, fallback = null, children }: Props) {
  const { can } = useOrgMemberPermissions();
  return <>{can(...permissions) ? children : fallback}</>;
}
