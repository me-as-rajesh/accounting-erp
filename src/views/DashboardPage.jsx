import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { activeCompanyId } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      setStats(null);
      if (!activeCompanyId) return;
      try {
        const { data } = await api.get(`/companies/${activeCompanyId}/dashboard/stats`);
        setStats(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      }
    })();
  }, [activeCompanyId]);

  if (!activeCompanyId) {
    return (
      <div className="card">
        <h2>Dashboard</h2>
        <p className="muted">Select or create a company to get started.</p>
        <Link className="btn primary" to="/companies">Go to Companies</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {error ? <div className="alert">{error}</div> : null}
      {stats ? (
        <div className="grid">
          <div className="card"><div className="k">Total Vouchers</div><div className="v">{stats.totalVouchers}</div></div>
          <div className="card"><div className="k">Total Ledgers</div><div className="v">{stats.totalLedgers}</div></div>
          <div className="card"><div className="k">Total Debit</div><div className="v">{Number(stats.totalDr || 0).toFixed(2)}</div></div>
          <div className="card"><div className="k">Total Credit</div><div className="v">{Number(stats.totalCr || 0).toFixed(2)}</div></div>
        </div>
      ) : (
        <div className="muted">Loading stats…</div>
      )}
    </div>
  );
}
