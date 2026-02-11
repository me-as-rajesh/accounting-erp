import mongoose from 'mongoose';

const accountGroupSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    groupName: { type: String, required: true, trim: true },
    parentGroup: { type: String, default: null },
    category: { type: String, enum: ['Asset', 'Liability', 'Income', 'Expense'], required: true },
    isPredefined: { type: Boolean, default: false }
  },
  { timestamps: true }
);

accountGroupSchema.index({ company: 1, groupName: 1 }, { unique: true });

const AccountGroup = mongoose.models.AccountGroup || mongoose.model('AccountGroup', accountGroupSchema);

export default AccountGroup;
