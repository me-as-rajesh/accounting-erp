# Accounting ERP System

A comprehensive web-based Enterprise Resource Planning (ERP) system designed for managing accounting operations. This application provides features for managing multiple companies, maintaining ledgers, recording vouchers, and generating detailed financial reports.

**Live Demo:** [https://accounting-erp-seven.vercel.app/](https://accounting-erp-seven.vercel.app/)

---

## 🎯 Overview

The Accounting ERP System is a full-stack web application that simplifies financial accounting and bookkeeping for small to medium-sized businesses. It allows users to manage multiple companies, create and track financial transactions through vouchers, maintain ledger accounts, and generate standard accounting reports.

---

## ✨ Key Features

### Authentication & User Management
- User registration and login with JWT-based authentication
- Secure password hashing using bcryptjs
- Token-based session management
- Protected routes and endpoints

### Company Management
- Create and manage multiple companies
- Define financial year for each company
- Customize currency symbol per company
- Switch between companies seamlessly

### Account Management
- Create and organize account groups (Assets, Liabilities, Income, Expenses)
- Create individual ledger accounts under account groups
- Manage opening balances for ledgers
- Track contact details (email, phone, address, city, state, pincode)
- Support for GST (GSTIN) and PAN number tracking
- Credit limit and credit days management for customer/vendor accounts

### Voucher Management
- Record different types of vouchers:
  - **Payment Vouchers** - for outgoing payments
  - **Receipt Vouchers** - for incoming receipts
  - **Contra Vouchers** - for bank transfers
  - **Journal Vouchers** - for general journal entries
- Add multiple entries (Debit/Credit) per voucher
- Track cheque details, bank information, and references
- Maintain narration and remarks for each voucher

### Financial Reporting
- **Trial Balance Report** - Verify total debits equal total credits
- **Ledger Statement** - Detailed transaction history for specific accounts
- **Balance Sheet Report** - Assets vs. Liabilities & Equity
- **Profit & Loss Report** - Revenue vs. Expenses analysis

### Dashboard
- Quick statistics displaying:
  - Total number of vouchers
  - Total number of ledgers
  - Total Debit and Credit amounts
- Visual overview of company financial status

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js (v4.19.2)** - Web application framework
- **MongoDB & Mongoose (v8.10.0)** - NoSQL database and ODM
- **JWT (jsonwebtoken v9.0.2)** - Authentication tokens
- **bcryptjs (v2.4.3)** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend
- **React (v18.2.0)** - UI library
- **React DOM** - React rendering to the DOM
- **Next.js (v14.1.0)** - React framework with server-side rendering
- **Axios (v1.13.5)** - HTTP client for API calls
- **React Router DOM (v6.22.0)** - Client-side routing
- **SASS/SCSS (v1.71.0)** - CSS preprocessor

### Deployment
- **Vercel** - Hosting platform for Next.js applications
- MongoDB Atlas (or compatible) - Cloud database

---

## 📁 Project Structure

```
accounting-erp/
├── backend/                          # Node.js/Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/                 # Business logic
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── company.controller.js   # Company operations
│   │   ├── dashboard.controller.js # Dashboard statistics
│   │   ├── group.controller.js     # Account group operations
│   │   ├── ledger.controller.js    # Ledger account operations
│   │   ├── report.controller.js    # Financial report generation
│   │   └── voucher.controller.js   # Voucher management
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication middleware
│   │   ├── companyAccess.js        # Company access verification
│   │   └── errorHandler.js         # Global error handling
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js                 # User schema
│   │   ├── Company.js              # Company schema
│   │   ├── AccountGroup.js         # Account group schema
│   │   ├── Ledger.js               # Ledger account schema
│   │   └── Voucher.js              # Voucher schema
│   ├── routes/                     # API route handlers
│   │   ├── auth.routes.js
│   │   ├── company.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── group.routes.js
│   │   ├── ledger.routes.js
│   │   ├── report.routes.js
│   │   └── voucher.routes.js
│   └── utils/
│       └── jwt.js                  # JWT utilities
├── src/                            # Frontend React/Next.js application
│   ├── assets/                     # Static assets
│   │   ├── css/
│   │   └── images/
│   ├── components/                 # Reusable React components
│   │   ├── Layout.jsx              # Main layout component
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context/state
│   ├── pages/                      # Next.js pages
│   │   ├── _app.jsx                # App wrapper
│   │   ├── [[...index]].jsx        # Dynamic routing
│   │   └── api/                    # API route handlers
│   ├── services/
│   │   └── api.js                  # API client configuration
│   ├── styles.css                  # Global styles
│   └── views/                      # Page components
│       ├── CompaniesPage.jsx       # Company management
│       ├── DashboardPage.jsx       # Dashboard view
│       ├── GroupsPage.jsx          # Account groups management
│       ├── LedgersPage.jsx         # Ledger accounts management
│       ├── LoginPage.jsx           # Login page
│       ├── RegisterPage.jsx        # Registration page
│       ├── VouchersPage.jsx        # Voucher management
│       ├── reports/                # Report pages
│       │   ├── BalanceSheetPage.jsx
│       │   ├── LedgerStatementPage.jsx
│       │   ├── ProfitLossPage.jsx
│       │   └── TrialBalancePage.jsx
│       └── api/                    # API utilities
├── app.js                          # Express app configuration
├── index.js                        # Server entry point
├── main.jsx                        # React entry point
├── next.config.js                  # Next.js configuration
├── package.json                    # Project dependencies
├── vercel.json                     # Vercel deployment config
└── database.sql                    # SQL schema reference
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/me-as-rajesh/accounting-erp.git
cd accounting-erp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/accounting_erp

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup

The application uses MongoDB with Mongoose. Schemas are automatically created when models are first accessed. Reference the `database.sql` file for the schema structure.

### 5. Run the Application

#### Development Mode
```bash
npm run dev
```

This starts:
- Frontend: Next.js development server (typically on `http://localhost:3000`)
- Backend: Express server (typically on `http://localhost:5000`)

#### Production Mode
```bash
npm run build
npm start
```

#### Run Backend Only
```bash
npm run server
```

---

## 📊 Database Schema

### Users Table
- `_id` - Unique user identifier
- `username` - Unique username
- `passwordHash` - Hashed password
- `fullName` - User's full name
- `activeCompany` - Currently selected company
- `timestamps` - Created and updated timestamps

### Companies Table
- `_id` - Unique company identifier
- `user` - Reference to user (owner)
- `companyName` - Name of the company
- `address` - Company address
- `financialYearStart` - FY start date
- `financialYearEnd` - FY end date
- `currencySymbol` - Currency symbol (₹, $, etc.)
- `timestamps` - Created and updated timestamps

### Account Groups Table
- `_id` - Unique group identifier
- `company` - Reference to company
- `groupName` - Name of account group
- `category` - Asset, Liability, Income, or Expense
- `parentGroup` - Self-referencing for hierarchy (optional)

### Ledgers Table
- `_id` - Unique ledger identifier
- `company` - Reference to company
- `group` - Reference to account group
- `ledgerName` - Name of the account
- `openingBalance` - Initial balance
- `openingBalanceType` - Debit or Credit
- `email`, `phone`, `address`, `city`, `state`, `pincode` - Contact details
- `panNumber`, `gstin` - Tax identification
- `creditLimit`, `creditDays` - Credit terms
- `timestamps` - Created and updated timestamps

### Vouchers Table
- `_id` - Unique voucher identifier
- `company` - Reference to company
- `voucherType` - Payment, Receipt, Contra, or Journal
- `voucherNumber` - Unique voucher number
- `voucherDate` - Date of transaction
- `narration` - Voucher description
- `entries` - Array of debit/credit entries
- `referenceNo`, `chequeNumber`, `bankName` - Additional details
- `timestamps` - Created and updated timestamps

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (protected)

### Companies
- `GET /api/companies` - List user's companies (protected)
- `POST /api/companies` - Create new company (protected)
- `GET /api/companies/:id` - Get company details (protected)
- `PUT /api/companies/:id` - Update company (protected)
- `DELETE /api/companies/:id` - Delete company (protected)
- `POST /api/companies/:id/select` - Select active company (protected)

### Account Groups
- `GET /api/companies/:companyId/groups` - List account groups (protected)
- `POST /api/companies/:companyId/groups` - Create account group (protected)
- `PUT /api/groups/:groupId` - Update account group (protected)
- `DELETE /api/groups/:groupId` - Delete account group (protected)

### Ledgers
- `GET /api/companies/:companyId/ledgers` - List ledgers (protected)
- `POST /api/companies/:companyId/ledgers` - Create ledger (protected)
- `PUT /api/ledgers/:ledgerId` - Update ledger (protected)
- `DELETE /api/ledgers/:ledgerId` - Delete ledger (protected)

### Vouchers
- `GET /api/companies/:companyId/vouchers` - List vouchers (protected)
- `POST /api/companies/:companyId/vouchers` - Create voucher (protected)
- `PUT /api/vouchers/:voucherId` - Update voucher (protected)
- `DELETE /api/vouchers/:voucherId` - Delete voucher (protected)

### Reports
- `GET /api/companies/:companyId/reports/trial-balance` - Trial balance report (protected)
- `GET /api/companies/:companyId/reports/balance-sheet` - Balance sheet report (protected)
- `GET /api/companies/:companyId/reports/profit-loss` - Profit & loss report (protected)
- `GET /api/companies/:companyId/reports/ledger/:ledgerId` - Ledger statement (protected)

### Dashboard
- `GET /api/companies/:companyId/dashboard/stats` - Dashboard statistics (protected)

### Health Check
- `GET /api/health` - Application health status (public)

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/accounting_erp` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `http://localhost:5000/api` |

---

## 📝 Development Guide

### Adding New Features

1. **Backend (Express)**
   - Create controller in `backend/controllers/`
   - Create routes in `backend/routes/`
   - Add middleware in `backend/middleware/` if needed
   - Create or update models in `backend/models/`

2. **Frontend (React/Next.js)**
   - Create page component in `src/views/`
   - Create reusable components in `src/components/`
   - Update authentication context if needed in `src/context/`
   - Call APIs using axios instance from `src/services/api.js`

### Authentication Flow

1. User registers or logs in
2. Backend generates JWT token and returns user info
3. Frontend stores token in localStorage
4. Token is sent with every request via Authorization header
5. Backend middleware validates token
6. User can access protected routes and make API calls

### Company Context

- Each user can have multiple companies
- When accessing company-specific endpoints, the `companyId` parameter must be provided
- Middleware validates that the user has access to the requested company

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL` (your Vercel domain)

4. Deploy:
   ```bash
   vercel deploy
   ```

### Deploying Backend Separately

If deploying backend to a different platform (Heroku, Railway, etc.):

1. Update frontend API URL to match backend deployment URL
2. Configure CORS origin in `app.js` to accept requests from frontend domain
3. Set all environment variables on the hosting platform
4. Ensure MongoDB is accessible from your hosting platform

---

## 🧪 Testing

Run linter:
```bash
npm run lint
```

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build Next.js production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run server` | Run Express backend only |

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check if MongoDB is running (for local setup)
- Ensure IP whitelist includes your server (for MongoDB Atlas)

### Authentication Errors
- Clear browser localStorage and try again
- Verify `JWT_SECRET` is set correctly
- Check token expiration time

### CORS Issues
- Verify frontend URL is allowed in CORS configuration
- Check if credentials are being sent with requests
- Ensure API calls use correct base URL

### Port Already in Use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -ti :5000 | xargs kill -9

# For Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Support & Contribution

For issues, suggestions, or contributions:
- Create an issue on GitHub
- Submit pull requests
- Contact the development team

---

## 🔗 Useful Links

- **Live Application**: [https://accounting-erp-seven.vercel.app/](https://accounting-erp-seven.vercel.app/)
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Express.js Documentation**: https://expressjs.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev/

---

## 📋 Changelog

### Version 1.0.0
- Initial release
- User authentication system
- Company management
- Account groups and ledgers
- Voucher management with 4 types
- Financial reports (Trial Balance, Balance Sheet, P&L, Ledger Statement)
- Dashboard with key statistics
- Full responsive design

---

**Last Updated**: February 2026

**Repository**: [https://github.com/me-as-rajesh/accounting-erp](https://github.com/me-as-rajesh/accounting-erp)