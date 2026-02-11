import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './src/components/ProtectedRoute.jsx';
import Layout from './src/components/Layout.jsx';

import LoginPage from './src/views/LoginPage.jsx';
import RegisterPage from './src/views/RegisterPage.jsx';
import DashboardPage from './src/views/DashboardPage.jsx';
import CompaniesPage from './src/views/CompaniesPage.jsx';
import GroupsPage from './src/views/GroupsPage.jsx';
import LedgersPage from './src/views/LedgersPage.jsx';
import VouchersPage from './src/views/VouchersPage.jsx';
import TrialBalancePage from './src/views/reports/TrialBalancePage.jsx';
import ProfitLossPage from './src/views/reports/ProfitLossPage.jsx';
import BalanceSheetPage from './src/views/reports/BalanceSheetPage.jsx';
import LedgerStatementPage from './src/views/reports/LedgerStatementPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="ledgers" element={<LedgersPage />} />
        <Route path="vouchers" element={<VouchersPage />} />

        <Route path="reports/trial" element={<TrialBalancePage />} />
        <Route path="reports/pl" element={<ProfitLossPage />} />
        <Route path="reports/bs" element={<BalanceSheetPage />} />
        <Route path="reports/ledger" element={<LedgerStatementPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
