import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../utils/ApiError';
import { userHasPermission } from '../../../shared/constants/legacyPermissionMap';

export function customerRequirePermission(code: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.customerUser) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }
    // Org admins always have full access — bypass permission check
    if (req.customerUser.isOrgAdmin) {
      next();
      return;
    }
    if (!userHasPermission(req.customerUser.permissions, code)) {
      next(new ApiError(403, 'Forbidden'));
      return;
    }
    next();
  };
}
