import { Router } from 'express';

import { requireCompanyAccess } from '../middleware/companyAccess.js';
import controller from '../controllers/voucher.controller.js';

const router = Router({ mergeParams: true });

router.use(requireCompanyAccess);

router.get('/', controller.listVouchers);
router.get('/next-number', controller.nextVoucherNumber);
router.post('/', controller.createVoucher);
router.get('/:voucherId', controller.getVoucher);
router.delete('/:voucherId', controller.deleteVoucher);

export default router;
