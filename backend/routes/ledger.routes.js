import { Router } from 'express';

import { requireCompanyAccess } from '../middleware/companyAccess.js';
import controller from '../controllers/ledger.controller.js';

const router = Router({ mergeParams: true });

router.use(requireCompanyAccess);

router.get('/', controller.listLedgers);
router.post('/', controller.createLedger);
router.put('/:ledgerId', controller.updateLedger);
router.delete('/:ledgerId', controller.deleteLedger);

export default router;
