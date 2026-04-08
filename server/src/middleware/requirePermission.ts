import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import {
  LEGACY_COLON_TO_DOT,
  LEGACY_CUSTOMER_COLON_TO_DOT,
} from '../shared/constants/legacyPermissionMap';

function normalizePermission(p: string): string {
  return LEGACY_COLON_TO_DOT[p] ?? LEGACY_CUSTOMER_COLON_TO_DOT[p] ?? p;
}

export function requirePermission(...permissions: string[]) {
  const normalized = permissions.map(normalizePermission);
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    const userPerms = req.user.permissions ?? [];
    const ok = normalized.every((p) => userPerms.includes(p));
    if (!ok) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }
    next();
  };
}

export function requireAnyPermission(permissions: string[]) {
  const normalized = permissions.map(normalizePermission);
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    const userPerms = req.user.permissions ?? [];
    if (!normalized.some((p) => userPerms.includes(p))) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }
    next();
  };
}
