import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import type { ImpulseEntry } from '@impulse-log/shared';

function ImpulseList() {
  const { api, logout } = useAuth();
  const navigate = useNavigate();
  const [impulses, setImpulses] = useState<ImpulseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [didActFilter, setDidActFilter] = useState<'all' | 'yes' | 'no' | 'unknown'>('all');

  useEffect(() => {
    loadImpulses();
  }, [didActFilter]);

  const loadImpulses = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await api.getImpulses({
        didAct: didActFilter,
      });
      setImpulses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load impulses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <>
      <nav className="nav">
        <h2>ImpulseLog</h2>
        <div className="nav-links">
          <span className="link" onClick={() => navigate('/')}>
            Home
          </span>
          <span className="link" onClick={() => navigate('/account')}>
            Account
          </span>
          <span className="link" onClick={() => navigate('/settings')}>
            Settings
          </span>
          <button onClick={handleLogout} style={{ width: 'auto', padding: '8px 16px' }}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>My Impulses</h1>
            <button
              onClick={loadImpulses}
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Refresh
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="filter" style={{ marginRight: '10px', fontWeight: 600 }}>
              Filter by action:
            </label>
            <select
              id="filter"
              value={didActFilter}
              onChange={(e) => setDidActFilter(e.target.value as any)}
              style={{ padding: '8px' }}
            >
              <option value="all">All</option>
              <option value="yes">Acted on it</option>
              <option value="no">Resisted</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {loading && <p>Loading impulses...</p>}
          {error && <div className="error">{error}</div>}

          {!loading && impulses.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              No impulses recorded yet. Use Ctrl+Shift+I to quickly log an impulse!
            </p>
          )}

          {!loading && impulses.length > 0 && (
            <div>
              {impulses.map((impulse) => (
                <div
                  key={impulse.id}
                  onClick={() => navigate(`/impulses/${impulse.id}`)}
                  style={{
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '16px' }}>{impulse.impulseText}</strong>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor:
                          impulse.didAct === 'yes'
                            ? '#ffc107'
                            : impulse.didAct === 'no'
                            ? '#28a745'
                            : '#6c757d',
                        color: 'white',
                      }}
                    >
                      {impulse.didAct === 'yes' ? 'Acted' : impulse.didAct === 'no' ? 'Resisted' : 'Unknown'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDate(impulse.createdAt)}
                  </div>
                  {impulse.trigger && (
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      Trigger: {impulse.trigger}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ImpulseList;
