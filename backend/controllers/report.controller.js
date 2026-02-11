import mongoose from 'mongoose';

import AccountGroup from '../models/AccountGroup.js';
import Ledger from '../models/Ledger.js';
import Voucher from '../models/Voucher.js';

function signedOpening(ledger) {
  const opening = Number(ledger.openingBalance || 0);
  return ledger.openingBalanceType === 'Dr' ? opening : -opening;
}

async function getLedgerMovements(companyId) {
  const rows = await Voucher.aggregate([
    { $match: { company: new mongoose.Types.ObjectId(companyId) } },
    { $unwind: '$entries' },
    {
      $group: {
        _id: '$entries.ledger',
        dr: { $sum: { $cond: [{ $eq: ['$entries.type', 'Dr'] }, '$entries.amount', 0] } },
        cr: { $sum: { $cond: [{ $eq: ['$entries.type', 'Cr'] }, '$entries.amount', 0] } }
      }
    }
  ]);

  const map = new Map();
  for (const r of rows) {
    map.set(r._id.toString(), { dr: r.dr || 0, cr: r.cr || 0 });
  }
  return map;
}

async function trialBalance(req, res) {
  const [groups, ledgers, movementMap] = await Promise.all([
    AccountGroup.find({ company: req.company._id }).select('_id groupName').lean(),
    Ledger.find({ company: req.company._id }).select('_id group ledgerName openingBalance openingBalanceType').lean(),
    getLedgerMovements(req.company._id)
  ]);

  const groupNameById = new Map(groups.map((g) => [g._id.toString(), g.groupName]));
  const balancesByGroup = new Map();

  for (const l of ledgers) {
    const mv = movementMap.get(l._id.toString()) || { dr: 0, cr: 0 };
    const closing = signedOpening(l) + (mv.dr - mv.cr);
    const groupId = l.group.toString();
    const groupName = groupNameById.get(groupId) || 'Unknown';
    balancesByGroup.set(groupName, (balancesByGroup.get(groupName) || 0) + closing);
  }

  const drGroups = [];
  const crGroups = [];
  let grandTotalDr = 0;
  let grandTotalCr = 0;

  for (const [groupName, bal] of Array.from(balancesByGroup.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (bal > 0) {
      drGroups.push({ name: groupName, amount: bal });
      grandTotalDr += bal;
    } else if (bal < 0) {
      crGroups.push({ name: groupName, amount: Math.abs(bal) });
      grandTotalCr += Math.abs(bal);
    }
  }

  return res.json({
    drGroups,
    crGroups,
    grandTotalDr,
    grandTotalCr,
    diff: grandTotalDr - grandTotalCr
  });
}

async function ledgerStatement(req, res) {
  const ledgerId = req.params.ledgerId;
  const ledger = await Ledger.findOne({ _id: ledgerId, company: req.company._id }).populate('group', 'groupName category');
  if (!ledger) return res.status(404).json({ message: 'Ledger not found' });

  const vouchers = await Voucher.aggregate([
    { $match: { company: req.company._id } },
    { $unwind: '$entries' },
    { $match: { 'entries.ledger': new mongoose.Types.ObjectId(ledgerId) } },
    {
      $project: {
        voucherDate: 1,
        voucherNumber: 1,
        voucherType: 1,
        narration: 1,
        amount: '$entries.amount',
        type: '$entries.type'
      }
    },
    { $sort: { voucherDate: 1, _id: 1 } }
  ]);

  let running = ledger.openingBalanceType === 'Dr' ? ledger.openingBalance : -ledger.openingBalance;
  const lines = [];

  lines.push({
    kind: 'opening',
    date: null,
    voucherNumber: null,
    voucherType: null,
    narration: 'Opening Balance',
    dr: null,
    cr: null,
    balance: { amount: Math.abs(running), type: running >= 0 ? 'Dr' : 'Cr' }
  });

  let totalDr = 0;
  let totalCr = 0;

  for (const v of vouchers) {
    const dr = v.type === 'Dr' ? v.amount : 0;
    const cr = v.type === 'Cr' ? v.amount : 0;
    totalDr += dr;
    totalCr += cr;
    running += dr - cr;

    lines.push({
      kind: 'entry',
      date: v.voucherDate,
      voucherNumber: v.voucherNumber,
      voucherType: v.voucherType,
      narration: v.narration || '',
      dr: dr || null,
      cr: cr || null,
      balance: { amount: Math.abs(running), type: running >= 0 ? 'Dr' : 'Cr' }
    });
  }

  return res.json({
    ledger: {
      id: ledger._id,
      ledgerName: ledger.ledgerName,
      openingBalance: ledger.openingBalance,
      openingBalanceType: ledger.openingBalanceType
    },
    totals: {
      totalDr,
      totalCr,
      closing: { amount: Math.abs(running), type: running >= 0 ? 'Dr' : 'Cr' }
    },
    lines
  });
}

async function profitLoss(req, res) {
  const [groups, ledgers, movementMap] = await Promise.all([
    AccountGroup.find({ company: req.company._id, category: { $in: ['Income', 'Expense'] } }).select('_id groupName category').lean(),
    Ledger.find({ company: req.company._id }).select('_id group openingBalance openingBalanceType').lean(),
    getLedgerMovements(req.company._id)
  ]);

  const groupMetaById = new Map(groups.map((g) => [g._id.toString(), { name: g.groupName, category: g.category }]));
  const expensesByGroup = new Map();
  const incomesByGroup = new Map();

  for (const l of ledgers) {
    const meta = groupMetaById.get(l.group.toString());
    if (!meta) continue;
    const mv = movementMap.get(l._id.toString()) || { dr: 0, cr: 0 };
    const closing = signedOpening(l) + (mv.dr - mv.cr);

    if (meta.category === 'Expense') {
      expensesByGroup.set(meta.name, (expensesByGroup.get(meta.name) || 0) + closing);
    } else {
      incomesByGroup.set(meta.name, (incomesByGroup.get(meta.name) || 0) + -closing);
    }
  }

  const expenses = Array.from(expensesByGroup.entries())
    .filter(([, amt]) => Math.abs(amt) > 0.00001)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const incomes = Array.from(incomesByGroup.entries())
    .filter(([, amt]) => Math.abs(amt) > 0.00001)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);
  const totalIncome = incomes.reduce((s, x) => s + x.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return res.json({ expenses, incomes, totalExpense, totalIncome, netProfit });
}

async function balanceSheet(req, res) {
  const [groups, ledgers, movementMap] = await Promise.all([
    AccountGroup.find({ company: req.company._id, category: { $in: ['Asset', 'Liability'] } }).select('_id groupName category').lean(),
    Ledger.find({ company: req.company._id }).select('_id group openingBalance openingBalanceType').lean(),
    getLedgerMovements(req.company._id)
  ]);

  const groupMetaById = new Map(groups.map((g) => [g._id.toString(), { name: g.groupName, category: g.category }]));
  const assetsByGroup = new Map();
  const liabilitiesByGroup = new Map();

  for (const l of ledgers) {
    const meta = groupMetaById.get(l.group.toString());
    if (!meta) continue;
    const mv = movementMap.get(l._id.toString()) || { dr: 0, cr: 0 };
    const closing = signedOpening(l) + (mv.dr - mv.cr);

    if (meta.category === 'Asset') {
      assetsByGroup.set(meta.name, (assetsByGroup.get(meta.name) || 0) + closing);
    } else {
      liabilitiesByGroup.set(meta.name, (liabilitiesByGroup.get(meta.name) || 0) + -closing);
    }
  }

  const assets = Array.from(assetsByGroup.entries())
    .filter(([, amt]) => Math.abs(amt) > 0.00001)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const liabilities = Array.from(liabilitiesByGroup.entries())
    .filter(([, amt]) => Math.abs(amt) > 0.00001)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalAssets = assets.reduce((s, x) => s + x.amount, 0);
  const totalLiabilities = liabilities.reduce((s, x) => s + x.amount, 0);
  const diff = totalAssets - totalLiabilities;

  return res.json({ assets, liabilities, totalAssets, totalLiabilities, profitLossDiff: diff });
}

export default { trialBalance, ledgerStatement, profitLoss, balanceSheet };
