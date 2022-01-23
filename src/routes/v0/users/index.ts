import * as express from 'express';
import { requireScope } from '../../../middlewares/requireScope.middleware';

import {
  getUsersPaginated,
  getUsersPaginatedValidator,
  patchUser,
  patchUserValidator,
  postUser,
  postUserValidator,
} from './users.controller';

const router = express.Router();

router.get('/', getUsersPaginatedValidator, getUsersPaginated);
router.post('/', requireScope(['admin:root', 'users:create']), postUserValidator, postUser);
router.patch('/:id', requireScope(['admin:root', 'users:update']), patchUserValidator, patchUser);

export default router;
