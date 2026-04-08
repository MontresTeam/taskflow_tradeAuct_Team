import type { ReactNode } from 'react';
import { useProjectPermissions } from '../hooks/useProjectPermissions';

interface Props {
  projectId: string | undefined;
  permissions: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function ProjectPermissionGate({ projectId, permissions, fallback = null, children }: Props) {
  const { can } = useProjectPermissions(projectId);
  return <>{can(...permissions) ? children : fallback}</>;
}
