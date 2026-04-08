import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  createWorkLogHandler,
  getWorkLogs,
  updateWorkLogHandler,
  deleteWorkLog,
  workLogIdParamHandler,
  issueIdParamHandler,
} from './workLogs.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', ...issueIdParamHandler, asyncHandler(getWorkLogs));
router.post('/', ...issueIdParamHandler, ...createWorkLogHandler);
router.patch('/:id', ...workLogIdParamHandler, ...updateWorkLogHandler);
router.delete('/:id', ...workLogIdParamHandler, asyncHandler(deleteWorkLog));

export const workLogsRoutes = router;

