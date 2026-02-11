import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LedgersPage() {
  const { activeCompanyId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [error, setError] = useState('');

  const [ledgerName, setLedgerName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [openingBalanceType, setOpeningBalanceType] = useState('Dr');

  const canUse = useMemo(() => Boolean(activeCompanyId), [activeCompanyId]);

  const load = async () => {
    const [g, l] = await Promise.all([
      api.get(`/companies/${activeCompanyId}/groups`),
      api.get(`/companies/${activeCompanyId}/ledgers`)
    ]);
    setGroups(g.data.groups || []);
    setLedgers(l.data.ledgers || []);
  };

  useEffect(() => {
    (async () => {
      setError('');
      setGroups([]);
      setLedgers([]);
      if (!activeCompanyId) return;
      try {
        await load();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load ledgers');
      }
    })();
  }, [activeCompanyId]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/companies/${activeCompanyId}/ledgers`, {
        ledgerName,
        groupId,
        openingBalance: Number(openingBalance || 0),
        openingBalanceType
      });
      setLedgerName('');
      setGroupId('');
      setOpeningBalance('0');
      setOpeningBalanceType('Dr');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create ledger');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this ledger?')) return;
    setError('');
    try {
      await api.delete(`/companies/${activeCompanyId}/ledgers/${id}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete ledger');
    }
  };

  if (!canUse) {
    return <div className="card">Select a company first (Companies page).</div>;
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2>Create Ledger</h2>
        {error ? <div className="alert">{error}</div> : null}
        <form onSubmit={onCreate} className="stack">
          <label>
            Ledger Name
            <input value={ledgerName} onChange={(e) => setLedgerName(e.target.value)} required />
          </label>
          <label>
            Under Group
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} required>
              <option value="">Select group</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>{g.groupName} ({g.category})</option>
              ))}
            </select>
          </label>
          <div className="row">
            <label>
              Opening Balance
              <input type="number" step="0.01" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} />
            </label>
            <label>
              Dr/Cr
              <select value={openingBalanceType} onChange={(e) => setOpeningBalanceType(e.target.value)}>
                <option value="Dr">Dr</option>
                <option value="Cr">Cr</option>
              </select>
            </label>
          </div>
          <button className="btn primary">Create</button>
        </form>
      </div>

      <div className="card">
        <h2>Ledgers</h2>
        <div className="table">
          <div className="thead">
            <div>Name</div>
            <div>Group</div>
            <div>Opening</div>
            <div>Actions</div>
          </div>
          {ledgers.map((l) => (
            <div key={l._id} className="trow">
              <div>{l.ledgerName}</div>
              <div>{l.group?.groupName || '—'}</div>
              <div>{Number(l.openingBalance || 0).toFixed(2)} {l.openingBalanceType}</div>
              <div className="actions">
                <button className="btn danger" onClick={() => onDelete(l._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
