import mongoose from 'mongoose';

const voucherEntrySchema = new mongoose.Schema(
  {
    ledger: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger', required: true },
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, enum: ['Dr', 'Cr'], required: true }
  },
  { _id: false }
);

const voucherSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    voucherType: { type: String, enum: ['Payment', 'Receipt', 'Contra', 'Journal'], required: true },
    voucherNumber: { type: String, required: true, trim: true },
    voucherDate: { type: Date, required: true },
    narration: { type: String, default: '' },

    referenceNo: { type: String, default: '' },
    referenceDate: { type: Date, default: null },
    chequeNumber: { type: String, default: '' },
    chequeDate: { type: Date, default: null },
    bankName: { type: String, default: '' },
    remarks: { type: String, default: '' },

    entries: { type: [voucherEntrySchema], validate: [(v) => v.length >= 2, 'At least two entries are required'] }
  },
  { timestamps: true }
);

voucherSchema.index({ company: 1, voucherNumber: 1 }, { unique: true });
voucherSchema.index({ company: 1, voucherDate: -1 });

const Voucher = mongoose.models.Voucher || mongoose.model('Voucher', voucherSchema);

export default Voucher;
