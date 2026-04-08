import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import {
  createCommentHandler,
  getComments,
  getCommentById,
  updateCommentHandler,
  deleteComment,
  commentIdParamHandler,
  issueIdOnlyParamHandler,
} from './comments.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', ...issueIdOnlyParamHandler, asyncHandler(getComments));
router.post('/', createCommentHandler);
router.get('/:id', ...commentIdParamHandler, asyncHandler(getCommentById));
router.patch('/:id', updateCommentHandler);
router.delete('/:id', ...commentIdParamHandler, asyncHandler(deleteComment));

export const commentsRoutes = router;
