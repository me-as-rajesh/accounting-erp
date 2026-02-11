import Voucher from '../models/Voucher.js';
import Ledger from '../models/Ledger.js';

async function stats(req, res) {
  const [totalVouchers, totalLedgers, totals] = await Promise.all([
    Voucher.countDocuments({ company: req.company._id }),
    Ledger.countDocuments({ company: req.company._id }),
    Voucher.aggregate([
      { $match: { company: req.company._id } },
      { $unwind: '$entries' },
      {
        $group: {
          _id: null,
          totalDr: { $sum: { $cond: [{ $eq: ['$entries.type', 'Dr'] }, '$entries.amount', 0] } },
          totalCr: { $sum: { $cond: [{ $eq: ['$entries.type', 'Cr'] }, '$entries.amount', 0] } }
        }
      }
    ])
  ]);

  const row = totals[0] || { totalDr: 0, totalCr: 0 };
  return res.json({
    totalVouchers,
    totalLedgers,
    totalDr: row.totalDr || 0,
    totalCr: row.totalCr || 0
  });
}

export default { stats };
