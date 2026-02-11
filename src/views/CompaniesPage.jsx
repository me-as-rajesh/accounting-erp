import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CompaniesPage() {
  const { activeCompanyId, selectCompany } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [financialYearStart, setFinancialYearStart] = useState('');
  const [financialYearEnd, setFinancialYearEnd] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  const load = async () => {
    const { data } = await api.get('/companies');
    setCompanies(data.companies || []);
  };

  useEffect(() => {
    (async () => {
      setError('');
      try {
        await load();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load companies');
      }
    })();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/companies', {
        companyName,
        address,
        financialYearStart,
        financialYearEnd,
        currencySymbol
      });
      setCompanyName('');
      setAddress('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create company');
    } finally {
      setBusy(false);
    }
  };

  const onSelect = async (id) => {
    setError('');
    try {
      await selectCompany(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to select company');
    }
  };

  return (
    <div className="grid2">
      <div>
        <h2>Companies</h2>
        {error ? <div className="alert">{error}</div> : null}
        <div className="card">
          <h3>My Companies</h3>
          {companies.length === 0 ? (
            <div className="muted">No companies yet.</div>
          ) : (
            <ul className="list">
              {companies.map((c) => (
                <li key={c._id} className={c._id === activeCompanyId ? 'active' : ''}>
                  <div>
                    <div className="title">{c.companyName}</div>
                    <div className="muted small">
                      FY: {new Date(c.financialYearStart).toLocaleDateString()} – {new Date(c.financialYearEnd).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="btn" onClick={() => onSelect(c._id)} disabled={c._id === activeCompanyId}>
                    {c._id === activeCompanyId ? 'Selected' : 'Select'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Create Company</h3>
        <form onSubmit={onCreate} className="stack">
          <label>
            Company Name
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </label>
          <label>
            Address
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          </label>
          <div className="row">
            <label>
              FY Start
              <input type="date" value={financialYearStart} onChange={(e) => setFinancialYearStart(e.target.value)} required />
            </label>
            <label>
              FY End
              <input type="date" value={financialYearEnd} onChange={(e) => setFinancialYearEnd(e.target.value)} required />
            </label>
          </div>
          <label>
            Currency Symbol
            <input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)} />
          </label>
          <button className="btn primary" disabled={busy}>{busy ? 'Creating…' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
