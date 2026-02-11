import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function BalanceSheetPage() {
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
        const { data } = await api.get(`/companies/${activeCompanyId}/reports/bs`);
        setData(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load balance sheet');
      }
    })();
  }, [activeCompanyId]);

  if (!canUse) return <div className="card">Select a company first (Companies page).</div>;

  return (
    <div>
      <h2>Balance Sheet</h2>
      {error ? <div className="alert">{error}</div> : null}
      {!data ? (
        <div className="muted">Loading…</div>
      ) : (
        <div className="grid2">
          <div className="card">
            <h3>Liabilities</h3>
            <ul className="list compact">
              {(data.liabilities || []).map((x) => (
                <li key={x.name}><span>{x.name}</span><span>{Number(x.amount || 0).toFixed(2)}</span></li>
              ))}
              {data.profitLossDiff > 0 ? (
                <li className="total"><span>Profit & Loss A/c (Profit)</span><span>{Number(data.profitLossDiff).toFixed(2)}</span></li>
              ) : null}
              <li className="total"><span>Total</span><span>{Number(data.totalLiabilities + (data.profitLossDiff > 0 ? data.profitLossDiff : 0)).toFixed(2)}</span></li>
            </ul>
          </div>
          <div className="card">
            <h3>Assets</h3>
            <ul className="list compact">
              {(data.assets || []).map((x) => (
                <li key={x.name}><span>{x.name}</span><span>{Number(x.amount || 0).toFixed(2)}</span></li>
              ))}
              {data.profitLossDiff < 0 ? (
                <li className="total"><span>Profit & Loss A/c (Loss)</span><span>{Number(Math.abs(data.profitLossDiff)).toFixed(2)}</span></li>
              ) : null}
              <li className="total"><span>Total</span><span>{Number(data.totalAssets + (data.profitLossDiff < 0 ? Math.abs(data.profitLossDiff) : 0)).toFixed(2)}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
