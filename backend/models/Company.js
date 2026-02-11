import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    financialYearStart: { type: Date, required: true },
    financialYearEnd: { type: Date, required: true },
    currencySymbol: { type: String, default: '₹' }
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
