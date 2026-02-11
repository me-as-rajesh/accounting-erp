import { Router } from 'express';

import { requireCompanyAccess } from '../middleware/companyAccess.js';
import controller from '../controllers/group.controller.js';

const router = Router({ mergeParams: true });

router.use(requireCompanyAccess);

router.get('/', controller.listGroups);
router.post('/', controller.createGroup);
router.put('/:groupId', controller.updateGroup);
router.delete('/:groupId', controller.deleteGroup);

export default router;
