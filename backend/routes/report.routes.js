import { Router } from 'express';

import { requireCompanyAccess } from '../middleware/companyAccess.js';
import controller from '../controllers/report.controller.js';

const router = Router({ mergeParams: true });

router.use(requireCompanyAccess);

router.get('/trial', controller.trialBalance);
router.get('/ledger/:ledgerId', controller.ledgerStatement);
router.get('/pl', controller.profitLoss);
router.get('/bs', controller.balanceSheet);

export default router;
