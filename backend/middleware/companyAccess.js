import Company from '../models/Company.js';

async function requireCompanyAccess(req, res, next) {
  const { companyId } = req.params;
  if (!companyId) return res.status(400).json({ message: 'Missing companyId' });

  const company = await Company.findOne({ _id: companyId, user: req.user.id });
  if (!company) return res.status(404).json({ message: 'Company not found' });

  req.company = company;
  return next();
}

export { requireCompanyAccess };
