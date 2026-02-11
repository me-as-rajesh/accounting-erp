import mongoose from 'mongoose';

import Voucher from '../models/Voucher.js';
import Ledger from '../models/Ledger.js';

function validateEntries(entries) {
  const cleaned = (Array.isArray(entries) ? entries : [])
    .map((e) => ({
      ledgerId: e.ledgerId || e.ledger,
      amount: Number(e.amount || 0),
      type: String(e.type || '').trim()
    }))
    .filter((e) => e.ledgerId && e.amount > 0 && (e.type === 'Dr' || e.type === 'Cr'));

  let totalDr = 0;
  let totalCr = 0;
  for (const e of cleaned) {
    if (e.type === 'Dr') totalDr += e.amount;
    else totalCr += e.amount;
  }

  return { cleaned, totalDr, totalCr };
}

async function listVouchers(req, res) {
  const vouchers = await Voucher.find({ company: req.company._id })
    .sort({ voucherDate: -1, createdAt: -1 })
    .select('voucherType voucherNumber voucherDate narration referenceNo entries createdAt');

  const data = vouchers.map((v) => {
    const totalDr = v.entries.reduce((sum, e) => (e.type === 'Dr' ? sum + e.amount : sum), 0);
    return {
      id: v._id,
      voucherType: v.voucherType,
      voucherNumber: v.voucherNumber,
      voucherDate: v.voucherDate,
      narration: v.narration,
      referenceNo: v.referenceNo,
      totalAmount: totalDr
    };
  });

  return res.json({ vouchers: data });
}

async function nextVoucherNumber(req, res) {
  const count = await Voucher.countDocuments({ company: req.company._id });
  return res.json({ next: String(count + 1) });
}

async function createVoucher(req, res) {
  const voucherType = String(req.body.voucherType || '').trim();
  const voucherNumber = String(req.body.voucherNumber || '').trim();
  const voucherDate = req.body.voucherDate;
  const narration = String(req.body.narration || '').trim();

  const { cleaned, totalDr, totalCr } = validateEntries(req.body.entries);

  if (!voucherType || !voucherNumber || !voucherDate) {
    return res.status(400).json({ message: 'voucherType, voucherNumber, voucherDate are required' });
  }
  if (cleaned.length < 2) {
    return res.status(400).json({ message: 'At least two entries are required' });
  }
  if (Math.abs(totalDr - totalCr) > 0.01) {
    return res.status(400).json({ message: `Mismatch in Dr (${totalDr}) and Cr (${totalCr}).` });
  }

  const ledgerIds = cleaned.map((e) => new mongoose.Types.ObjectId(e.ledgerId));
  const ledgers = await Ledger.find({ company: req.company._id, _id: { $in: ledgerIds } }).select('_id');
  if (ledgers.length !== new Set(ledgerIds.map((x) => x.toString())).size) {
    return res.status(400).json({ message: 'One or more ledger entries are invalid for this company' });
  }

  const voucher = await Voucher.create({
    company: req.company._id,
    voucherType,
    voucherNumber,
    voucherDate,
    narration,
    referenceNo: String(req.body.referenceNo || ''),
    referenceDate: req.body.referenceDate || null,
    chequeNumber: String(req.body.chequeNumber || ''),
    chequeDate: req.body.chequeDate || null,
    bankName: String(req.body.bankName || ''),
    remarks: String(req.body.remarks || ''),
    entries: cleaned.map((e) => ({ ledger: e.ledgerId, amount: e.amount, type: e.type }))
  });

  return res.status(201).json({ voucher });
}

async function getVoucher(req, res) {
  const voucher = await Voucher.findOne({ _id: req.params.voucherId, company: req.company._id }).populate('entries.ledger', 'ledgerName');
  if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
  return res.json({ voucher });
}

async function deleteVoucher(req, res) {
  const voucher = await Voucher.findOneAndDelete({ _id: req.params.voucherId, company: req.company._id });
  if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
  return res.json({ ok: true });
}

export default {
  listVouchers,
  nextVoucherNumber,
  createVoucher,
  getVoucher,
  deleteVoucher
};
