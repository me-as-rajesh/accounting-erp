import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountGroup', required: true, index: true },
    ledgerName: { type: String, required: true, trim: true },
    openingBalance: { type: Number, default: 0 },
    openingBalanceType: { type: String, enum: ['Dr', 'Cr'], required: true },

    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    panNumber: { type: String, default: '' },
    gstin: { type: String, default: '' },
    creditLimit: { type: Number, default: 0 },
    creditDays: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ledgerSchema.index({ company: 1, ledgerName: 1 }, { unique: true });

const Ledger = mongoose.models.Ledger || mongoose.model('Ledger', ledgerSchema);

export default Ledger;
