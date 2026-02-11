import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const VOUCHER_TYPES = ['Payment', 'Receipt', 'Contra', 'Journal'];

function sum(entries, type) {
  return entries.reduce((s, e) => s + (e.type === type ? Number(e.amount || 0) : 0), 0);
}

export default function VouchersPage() {
  const { activeCompanyId } = useAuth();
  const [error, setError] = useState('');
  const [mode, setMode] = useState('list');

  const [ledgers, setLedgers] = useState([]);
  const [vouchers, setVouchers] = useState([]);

  const [voucherType, setVoucherType] = useState('Payment');
  const [voucherDate, setVoucherDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [voucherNumber, setVoucherNumber] = useState('');
  const [narration, setNarration] = useState('');

  const [entries, setEntries] = useState([
    { type: 'Dr', ledgerId: '', amount: '' },
    { type: 'Cr', ledgerId: '', amount: '' }
  ]);

  const canUse = useMemo(() => Boolean(activeCompanyId), [activeCompanyId]);
  const totalDr = sum(entries, 'Dr');
  const totalCr = sum(entries, 'Cr');

  const loadList = async () => {
    const { data } = await api.get(`/companies/${activeCompanyId}/vouchers`);
    setVouchers(data.vouchers || []);
  };

  const loadCreate = async () => {
    const [l, n] = await Promise.all([
      api.get(`/companies/${activeCompanyId}/ledgers`),
      api.get(`/companies/${activeCompanyId}/vouchers/next-number`)
    ]);
    setLedgers(l.data.ledgers || []);
    setVoucherNumber(n.data.next || '1');
  };

  useEffect(() => {
    (async () => {
      setError('');
      setVouchers([]);
      if (!activeCompanyId) return;
      try {
        await loadList();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load vouchers');
      }
    })();
  }, [activeCompanyId]);

  const startCreate = async () => {
    setError('');
    try {
      await loadCreate();
      setMode('create');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to start create');
    }
  };

  const addRow = () => setEntries((prev) => [...prev, { type: 'Dr', ledgerId: '', amount: '' }]);
  const removeRow = (idx) => setEntries((prev) => prev.filter((_, i) => i !== idx));

  const updateEntry = (idx, patch) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setError('');
    const cleaned = entries
      .map((x) => ({ ...x, amount: Number(x.amount || 0) }))
      .filter((x) => x.ledgerId && x.amount > 0);

    if (cleaned.length < 2) {
      setError('At least two entries are required');
      return;
    }
    if (Math.abs(totalDr - totalCr) > 0.01) {
      setError(`Mismatch in totals: Dr ${totalDr.toFixed(2)} vs Cr ${totalCr.toFixed(2)}`);
      return;
    }

    try {
      await api.post(`/companies/${activeCompanyId}/vouchers`, {
        voucherType,
        voucherNumber,
        voucherDate,
        narration,
        entries: cleaned
      });
      setMode('list');
      setNarration('');
      setEntries([
        { type: 'Dr', ledgerId: '', amount: '' },
        { type: 'Cr', ledgerId: '', amount: '' }
      ]);
      await loadList();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save voucher');
    }
  };

  if (!canUse) {
    return <div className="card">Select a company first (Companies page).</div>;
  }

  if (mode === 'create') {
    return (
      <div>
        <div className="row between">
          <h2>Create Voucher</h2>
          <div className="row">
            <button className="btn" onClick={() => setMode('list')}>Cancel</button>
            <button className="btn primary" onClick={() => document.getElementById('voucherForm').requestSubmit()}>Save</button>
          </div>
        </div>

        {error ? <div className="alert">{error}</div> : null}

        <form id="voucherForm" onSubmit={onSave} className="card stack">
          <div className="row">
            <label>
              Type
              <select value={voucherType} onChange={(e) => setVoucherType(e.target.value)}>
                {VOUCHER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input type="date" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} required />
            </label>
            <label>
              No
              <input value={voucherNumber} onChange={(e) => setVoucherNumber(e.target.value)} required />
            </label>
          </div>

          <div>
            <div className="row between">
              <h3>Entries</h3>
              <div className="muted">Total Dr must equal Total Cr</div>
            </div>
            <div className="table">
              <div className="thead">
                <div>Dr/Cr</div>
                <div>Ledger</div>
                <div>Amount</div>
                <div>Action</div>
              </div>
              {entries.map((e, idx) => (
                <div key={idx} className="trow">
                  <div>
                    <select value={e.type} onChange={(ev) => updateEntry(idx, { type: ev.target.value })}>
                      <option value="Dr">Dr</option>
                      <option value="Cr">Cr</option>
                    </select>
                  </div>
                  <div>
                    <select value={e.ledgerId} onChange={(ev) => updateEntry(idx, { ledgerId: ev.target.value })}>
                      <option value="">Select ledger</option>
                      {ledgers.map((l) => (
                        <option key={l._id} value={l._id}>{l.ledgerName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input type="number" step="0.01" value={e.amount} onChange={(ev) => updateEntry(idx, { amount: ev.target.value })} />
                  </div>
                  <div className="actions">
                    <button className="btn danger" type="button" onClick={() => removeRow(idx)} disabled={entries.length <= 2}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="row between">
              <button className="btn" type="button" onClick={addRow}>+ Add Line</button>
              <div className={Math.abs(totalDr - totalCr) > 0.01 ? 'pill warn' : 'pill ok'}>
                Dr {totalDr.toFixed(2)} | Cr {totalCr.toFixed(2)}
              </div>
            </div>
          </div>

          <label>
            Narration
            <textarea value={narration} onChange={(e) => setNarration(e.target.value)} rows={2} />
          </label>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="row between">
        <h2>Vouchers</h2>
        <button className="btn primary" onClick={startCreate}>Create Voucher</button>
      </div>
      {error ? <div className="alert">{error}</div> : null}

      <div className="card">
        <div className="table">
          <div className="thead">
            <div>Date</div>
            <div>No</div>
            <div>Type</div>
            <div>Narration</div>
            <div>Amount</div>
          </div>
          {vouchers.map((v) => (
            <div key={v.id} className="trow">
              <div>{new Date(v.voucherDate).toLocaleDateString()}</div>
              <div>{v.voucherNumber}</div>
              <div>{v.voucherType}</div>
              <div className="muted">{v.narration || ''}</div>
              <div>{Number(v.totalAmount || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
