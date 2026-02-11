import Ledger from '../models/Ledger.js';
import AccountGroup from '../models/AccountGroup.js';
import Voucher from '../models/Voucher.js';

async function listLedgers(req, res) {
  const ledgers = await Ledger.find({ company: req.company._id })
    .populate('group', 'groupName category')
    .sort({ ledgerName: 1 });
  return res.json({ ledgers });
}

async function createLedger(req, res) {
  const ledgerName = String(req.body.ledgerName || '').trim();
  const groupId = String(req.body.groupId || '').trim();
  const openingBalance = Number(req.body.openingBalance || 0);
  const openingBalanceType = String(req.body.openingBalanceType || '').trim();

  if (!ledgerName || !groupId || !openingBalanceType) {
    return res.status(400).json({ message: 'ledgerName, groupId, openingBalanceType are required' });
  }

  const group = await AccountGroup.findOne({ _id: groupId, company: req.company._id });
  if (!group) return res.status(400).json({ message: 'Invalid groupId' });

  const ledger = await Ledger.create({
    company: req.company._id,
    group: group._id,
    ledgerName,
    openingBalance,
    openingBalanceType,
    email: String(req.body.email || ''),
    phone: String(req.body.phone || ''),
    address: String(req.body.address || ''),
    city: String(req.body.city || ''),
    state: String(req.body.state || ''),
    pincode: String(req.body.pincode || ''),
    panNumber: String(req.body.panNumber || ''),
    gstin: String(req.body.gstin || ''),
    creditLimit: Number(req.body.creditLimit || 0),
    creditDays: Number(req.body.creditDays || 0)
  });

  return res.status(201).json({ ledger });
}

async function updateLedger(req, res) {
  const ledger = await Ledger.findOne({ _id: req.params.ledgerId, company: req.company._id });
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });

  if (req.body.ledgerName != null) ledger.ledgerName = String(req.body.ledgerName).trim();
  if (req.body.groupId != null) {
    const group = await AccountGroup.findOne({ _id: req.body.groupId, company: req.company._id });
    if (!group) return res.status(400).json({ message: 'Invalid groupId' });
    ledger.group = group._id;
  }
  if (req.body.openingBalance != null) ledger.openingBalance = Number(req.body.openingBalance || 0);
  if (req.body.openingBalanceType != null) ledger.openingBalanceType = String(req.body.openingBalanceType).trim();

  const fields = [
    'email',
    'phone',
    'address',
    'city',
    'state',
    'pincode',
    'panNumber',
    'gstin',
    'creditLimit',
    'creditDays'
  ];
  for (const key of fields) {
    if (req.body[key] != null) {
      ledger[key] = key === 'creditLimit' || key === 'creditDays' ? Number(req.body[key] || 0) : String(req.body[key] || '');
    }
  }

  await ledger.save();
  return res.json({ ledger });
}

async function deleteLedger(req, res) {
  const ledger = await Ledger.findOne({ _id: req.params.ledgerId, company: req.company._id });
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });

  const inUse = await Voucher.exists({ company: req.company._id, 'entries.ledger': ledger._id });
  if (inUse) {
    return res.status(400).json({ message: 'Cannot delete ledger. It has voucher entries.' });
  }

  await ledger.deleteOne();
  return res.json({ ok: true });
}

export default { listLedgers, createLedger, updateLedger, deleteLedger };
