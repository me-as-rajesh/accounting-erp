import Company from '../models/Company.js';
import User from '../models/User.js';
import AccountGroup from '../models/AccountGroup.js';

const PREDEFINED_GROUPS = [
  ['Capital Account', 'Liability'],
  ['Fixed Assets', 'Asset'],
  ['Current Assets', 'Asset'],
  ['Current Liabilities', 'Liability'],
  ['Direct Income', 'Income'],
  ['Direct Expenses', 'Expense'],
  ['Indirect Income', 'Income'],
  ['Indirect Expenses', 'Expense'],
  ['Bank Accounts', 'Asset'],
  ['Cash-in-hand', 'Asset'],
  ['Purchases Accounts', 'Expense'],
  ['Sales Accounts', 'Income'],
  ['Sundry Creditors', 'Liability'],
  ['Sundry Debtors', 'Asset']
];

async function listCompanies(req, res) {
  const companies = await Company.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res.json({ companies });
}

async function createCompany(req, res) {
  const companyName = String(req.body.companyName || '').trim();
  const address = String(req.body.address || '').trim();
  const financialYearStart = req.body.financialYearStart;
  const financialYearEnd = req.body.financialYearEnd;
  const currencySymbol = String(req.body.currencySymbol || '₹').trim() || '₹';

  if (!companyName || !financialYearStart || !financialYearEnd) {
    return res.status(400).json({ message: 'companyName, financialYearStart, financialYearEnd are required' });
  }

  const company = await Company.create({
    user: req.user.id,
    companyName,
    address,
    financialYearStart,
    financialYearEnd,
    currencySymbol
  });

  await AccountGroup.insertMany(
    PREDEFINED_GROUPS.map(([groupName, category]) => ({
      company: company._id,
      groupName,
      category,
      isPredefined: true
    }))
  );

  await User.findByIdAndUpdate(req.user.id, { activeCompany: company._id });

  return res.status(201).json({ company });
}

async function getCompany(req, res) {
  const company = await Company.findOne({ _id: req.params.companyId, user: req.user.id });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json({ company });
}

async function updateCompany(req, res) {
  const updates = {};
  if (req.body.companyName != null) updates.companyName = String(req.body.companyName).trim();
  if (req.body.address != null) updates.address = String(req.body.address).trim();
  if (req.body.financialYearStart != null) updates.financialYearStart = req.body.financialYearStart;
  if (req.body.financialYearEnd != null) updates.financialYearEnd = req.body.financialYearEnd;
  if (req.body.currencySymbol != null) updates.currencySymbol = String(req.body.currencySymbol).trim();

  const company = await Company.findOneAndUpdate(
    { _id: req.params.companyId, user: req.user.id },
    { $set: updates },
    { new: true }
  );
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json({ company });
}

async function deleteCompany(req, res) {
  const company = await Company.findOneAndDelete({ _id: req.params.companyId, user: req.user.id });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  await User.updateMany({ activeCompany: company._id }, { $set: { activeCompany: null } });
  return res.json({ ok: true });
}

async function selectCompany(req, res) {
  const company = await Company.findOne({ _id: req.params.companyId, user: req.user.id });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  await User.findByIdAndUpdate(req.user.id, { activeCompany: company._id });
  return res.json({ company });
}

export default {
  listCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  selectCompany
};
