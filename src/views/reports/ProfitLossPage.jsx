import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProfitLossPage() {
  const { activeCompanyId } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const canUse = useMemo(() => Boolean(activeCompanyId), [activeCompanyId]);

  useEffect(() => {
    (async () => {
      setError('');
      setData(null);
      if (!activeCompanyId) return;
      try {
        const { data } = await api.get(`/companies/${activeCompanyId}/reports/pl`);
        setData(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load P&L');
      }
    })();
  }, [activeCompanyId]);

  if (!canUse) return <div className="card">Select a company first (Companies page).</div>;

  return (
    <div>
      <h2>Profit & Loss</h2>
      {error ? <div className="alert">{error}</div> : null}
      {!data ? (
        <div className="muted">Loading…</div>
      ) : (
        <div className="grid2">
          <div className="card">
            <h3>Expenses (Dr)</h3>
            <ul className="list compact">
              {(data.expenses || []).map((x) => (
                <li key={x.name}><span>{x.name}</span><span>{Number(x.amount || 0).toFixed(2)}</span></li>
              ))}
              {data.netProfit > 0 ? (
                <li className="total"><span>Net Profit</span><span>{Number(data.netProfit).toFixed(2)}</span></li>
              ) : null}
              <li className="total"><span>Total</span><span>{Number(Math.max(data.totalExpense + (data.netProfit > 0 ? data.netProfit : 0), data.totalIncome)).toFixed(2)}</span></li>
            </ul>
          </div>
          <div className="card">
            <h3>Incomes (Cr)</h3>
            <ul className="list compact">
              {(data.incomes || []).map((x) => (
                <li key={x.name}><span>{x.name}</span><span>{Number(x.amount || 0).toFixed(2)}</span></li>
              ))}
              {data.netProfit < 0 ? (
                <li className="total"><span>Net Loss</span><span>{Number(Math.abs(data.netProfit)).toFixed(2)}</span></li>
              ) : null}
              <li className="total"><span>Total</span><span>{Number(Math.max(data.totalExpense, data.totalIncome + (data.netProfit < 0 ? Math.abs(data.netProfit) : 0))).toFixed(2)}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
