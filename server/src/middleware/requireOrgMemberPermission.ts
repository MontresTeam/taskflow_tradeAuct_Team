import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import {
  LEGACY_COLON_TO_DOT,
  LEGACY_CUSTOMER_COLON_TO_DOT,
  mapLegacyCustomerPermissions,
} from '../shared/constants/legacyPermissionMap';

function normalizePermission(p: string): string {
  return LEGACY_COLON_TO_DOT[p] ?? LEGACY_CUSTOMER_COLON_TO_DOT[p] ?? p;
}

/** Customer portal JWT (`customerAuthMiddleware`). orgId in route must match token org. */
export function requireOrgMemberPermission(...permissions: string[]) {
  const normalized = permissions.map(normalizePermission);
  return (req: Request, _res: Response, next: NextFunction): void => {
    const orgId = req.params.orgId;
    if (!orgId) {
      next(new ApiError(400, 'orgId required'));
      return;
    }
    const cu = req.customerUser;
    if (!cu) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    if (cu.orgId !== orgId) {
      next(new ApiError(403, 'Forbidden'));
      return;
    }
    const memberPerms = mapLegacyCustomerPermissions(cu.permissions);
    if (!normalized.every((p) => memberPerms.includes(p))) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }
    next();
  };
}
