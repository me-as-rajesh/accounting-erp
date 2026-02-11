import { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = ['Asset', 'Liability', 'Income', 'Expense'];

export default function GroupsPage() {
  const { activeCompanyId } = useAuth();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  const [groupName, setGroupName] = useState('');
  const [category, setCategory] = useState('Asset');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Asset');

  const canUse = useMemo(() => Boolean(activeCompanyId), [activeCompanyId]);

  const load = async () => {
    const { data } = await api.get(`/companies/${activeCompanyId}/groups`);
    setGroups(data.groups || []);
  };

  useEffect(() => {
    (async () => {
      setError('');
      setGroups([]);
      if (!activeCompanyId) return;
      try {
        await load();
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load groups');
      }
    })();
  }, [activeCompanyId]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/companies/${activeCompanyId}/groups`, { groupName, category });
      setGroupName('');
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create group');
    }
  };

  const startEdit = (g) => {
    setEditingId(g._id);
    setEditName(g.groupName);
    setEditCategory(g.category);
  };

  const saveEdit = async () => {
    setError('');
    try {
      await api.put(`/companies/${activeCompanyId}/groups/${editingId}`, { groupName: editName, category: editCategory });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update group');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this group?')) return;
    setError('');
    try {
      await api.delete(`/companies/${activeCompanyId}/groups/${id}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete group');
    }
  };

  if (!canUse) {
    return <div className="card">Select a company first (Companies page).</div>;
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2>Create Group</h2>
        {error ? <div className="alert">{error}</div> : null}
        <form onSubmit={onCreate} className="stack">
          <label>
            Group Name
            <input value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <button className="btn primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2>Groups</h2>
        <div className="table">
          <div className="thead">
            <div>Name</div>
            <div>Category</div>
            <div>Type</div>
            <div>Actions</div>
          </div>
          {groups.map((g) => (
            <div key={g._id} className="trow">
              <div>
                {editingId === g._id ? (
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                ) : (
                  g.groupName
                )}
              </div>
              <div>
                {editingId === g._id ? (
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  g.category
                )}
              </div>
              <div>{g.isPredefined ? 'System' : 'User'}</div>
              <div className="actions">
                {editingId === g._id ? (
                  <>
                    <button className="btn" onClick={saveEdit}>Save</button>
                    <button className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => startEdit(g)}>Edit</button>
                    <button className="btn danger" onClick={() => onDelete(g._id)} disabled={g.isPredefined}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
