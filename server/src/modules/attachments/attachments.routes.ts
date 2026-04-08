import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  getAttachments,
  createAttachmentHandler,
  deleteAttachmentHandler,
  issueIdParamHandler,
} from './attachments.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', ...issueIdParamHandler, asyncHandler(getAttachments));
router.post('/', createAttachmentHandler);
router.delete('/:id', deleteAttachmentHandler);

export const attachmentsRoutes = router;
