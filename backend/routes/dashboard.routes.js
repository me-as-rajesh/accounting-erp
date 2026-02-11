import { Router } from 'express';

import { requireCompanyAccess } from '../middleware/companyAccess.js';
import controller from '../controllers/dashboard.controller.js';

const router = Router({ mergeParams: true });

router.use(requireCompanyAccess);

router.get('/stats', controller.stats);

export default router;
