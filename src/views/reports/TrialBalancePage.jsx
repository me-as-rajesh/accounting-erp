import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TrialBalancePage() {
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
        const { data } = await api.get(`/companies/${activeCompanyId}/reports/trial`);
        setData(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load trial balance');
      }
    })();
  }, [activeCompanyId]);

  if (!canUse) return <div className="card">Select a company first (Companies page).</div>;

  return (
    <div>
      <h2>Trial Balance</h2>
      {error ? <div className="alert">{error}</div> : null}
      {!data ? (
        <div className="muted">Loading…</div>
      ) : (
        <div className="card">
          <div className="table">
            <div className="thead">
              <div>Particulars</div>
              <div>Debit</div>
              <div>Credit</div>
            </div>
            {(() => {
              const all = new Map();
              for (const g of data.drGroups || []) all.set(g.name, { dr: g.amount, cr: 0 });
              for (const g of data.crGroups || []) all.set(g.name, { dr: all.get(g.name)?.dr || 0, cr: g.amount });
              return Array.from(all.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, v]) => (
                  <div key={name} className="trow">
                    <div>{name}</div>
                    <div>{v.dr ? Number(v.dr).toFixed(2) : ''}</div>
                    <div>{v.cr ? Number(v.cr).toFixed(2) : ''}</div>
                  </div>
                ));
            })()}
            <div className="trow total">
              <div>Total</div>
              <div>{Number(data.grandTotalDr || 0).toFixed(2)}</div>
              <div>{Number(data.grandTotalCr || 0).toFixed(2)}</div>
            </div>
          </div>
          {Math.abs(Number(data.diff || 0)) > 0.01 ? (
            <div className="alert">Warning: mismatch {Number(data.diff || 0).toFixed(2)}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
