import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LedgerStatementPage() {
  const { activeCompanyId } = useAuth();
  const [ledgers, setLedgers] = useState([]);
  const [ledgerId, setLedgerId] = useState('');
  const [statement, setStatement] = useState(null);
  const [error, setError] = useState('');
  const canUse = useMemo(() => Boolean(activeCompanyId), [activeCompanyId]);

  useEffect(() => {
    (async () => {
      setError('');
      setLedgers([]);
      setLedgerId('');
      setStatement(null);
      if (!activeCompanyId) return;
      try {
        const { data } = await api.get(`/companies/${activeCompanyId}/ledgers`);
        setLedgers(data.ledgers || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load ledgers');
      }
    })();
  }, [activeCompanyId]);

  useEffect(() => {
    (async () => {
      setError('');
      setStatement(null);
      if (!activeCompanyId || !ledgerId) return;
      try {
        const { data } = await api.get(`/companies/${activeCompanyId}/reports/ledger/${ledgerId}`);
        setStatement(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load statement');
      }
    })();
  }, [activeCompanyId, ledgerId]);

  if (!canUse) return <div className="card">Select a company first (Companies page).</div>;

  return (
    <div>
      <h2>Ledger Statement</h2>
      {error ? <div className="alert">{error}</div> : null}

      <div className="card stack">
        <label>
          Select Ledger
          <select value={ledgerId} onChange={(e) => setLedgerId(e.target.value)}>
            <option value="">Select</option>
            {ledgers.map((l) => (
              <option key={l._id} value={l._id}>{l.ledgerName}</option>
            ))}
          </select>
        </label>
      </div>

      {statement ? (
        <div className="card">
          <div className="table">
            <div className="thead">
              <div>Date</div>
              <div>Voucher No</div>
              <div>Particulars</div>
              <div>Debit</div>
              <div>Credit</div>
              <div>Balance</div>
            </div>
            {(statement.lines || []).map((x, idx) => (
              <div key={idx} className="trow">
                <div>{x.date ? new Date(x.date).toLocaleDateString() : ''}</div>
                <div>{x.voucherNumber || ''}</div>
                <div className="muted">{x.voucherType ? `${x.voucherType}${x.narration ? ` - ${x.narration}` : ''}` : x.narration}</div>
                <div>{x.dr != null ? Number(x.dr).toFixed(2) : ''}</div>
                <div>{x.cr != null ? Number(x.cr).toFixed(2) : ''}</div>
                <div>{Number(x.balance.amount || 0).toFixed(2)} {x.balance.type}</div>
              </div>
            ))}
            <div className="trow total">
              <div colSpan={3}>Totals</div>
              <div>{Number(statement.totals.totalDr || 0).toFixed(2)}</div>
              <div>{Number(statement.totals.totalCr || 0).toFixed(2)}</div>
              <div>{Number(statement.totals.closing.amount || 0).toFixed(2)} {statement.totals.closing.type}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
