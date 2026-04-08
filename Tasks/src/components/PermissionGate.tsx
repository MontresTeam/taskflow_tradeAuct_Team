import type { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface Props {
  permissions: string[];
  matchAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ permissions, matchAll = true, fallback = null, children }: Props) {
  const { can, canAny } = usePermissions();
  const ok = matchAll ? can(...permissions) : canAny(...permissions);
  return <>{ok ? children : fallback}</>;
}
