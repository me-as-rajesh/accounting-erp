import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import company from '../controllers/company.controller.js';

import groupRoutes from './group.routes.js';
import ledgerRoutes from './ledger.routes.js';
import voucherRoutes from './voucher.routes.js';
import reportRoutes from './report.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use(requireAuth);

router.get('/', company.listCompanies);
router.post('/', company.createCompany);

router.get('/:companyId', company.getCompany);
router.put('/:companyId', company.updateCompany);
router.delete('/:companyId', company.deleteCompany);
router.post('/:companyId/select', company.selectCompany);

router.use('/:companyId/groups', groupRoutes);
router.use('/:companyId/ledgers', ledgerRoutes);
router.use('/:companyId/vouchers', voucherRoutes);
router.use('/:companyId/reports', reportRoutes);
router.use('/:companyId/dashboard', dashboardRoutes);

export default router;
