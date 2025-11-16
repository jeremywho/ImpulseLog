import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import type { ImpulseEntry } from '@impulse-log/shared';

function ImpulseDetail() {
  const { api, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [impulse, setImpulse] = useState<ImpulseEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [impulseText, setImpulseText] = useState('');
  const [trigger, setTrigger] = useState('');
  const [emotion, setEmotion] = useState('');
  const [didAct, setDidAct] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadImpulse();
    }
  }, [id]);

  const loadImpulse = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const data = await api.getImpulse(id);
      setImpulse(data);
      setImpulseText(data.impulseText);
      setTrigger(data.trigger || '');
      setEmotion(data.emotion || '');
      setDidAct(data.didAct);
      setNotes(data.notes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load impulse');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = await api.updateImpulse(id, {
        impulseText,
        trigger: trigger || undefined,
        emotion: emotion || undefined,
        didAct,
        notes: notes || undefined,
      });
      setImpulse(updated);
      setIsEditing(false);
      setSuccess('Impulse updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update impulse');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this impulse?')) return;

    setSaving(true);
    setError('');

    try {
      await api.deleteImpulse(id);
      navigate('/impulses');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete impulse');
      setSaving(false);
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

  if (loading) {
    return (
      <>
        <nav className="nav">
          <h2>ImpulseLog</h2>
        </nav>
        <div className="container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!impulse) {
    return (
      <>
        <nav className="nav">
          <h2>ImpulseLog</h2>
        </nav>
        <div className="container">
          <div className="error">Impulse not found</div>
          <button onClick={() => navigate('/impulses')}>Back to List</button>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <h2>ImpulseLog</h2>
        <div className="nav-links">
          <span className="link" onClick={() => navigate('/')}>
            Home
          </span>
          <span className="link" onClick={() => navigate('/impulses')}>
            Impulses
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
        <div className="form-container" style={{ margin: '50px auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Impulse Details</h2>
            <button
              onClick={() => navigate('/impulses')}
              style={{ width: 'auto', padding: '8px 16px', backgroundColor: '#6c757d' }}
            >
              Back to List
            </button>
          </div>

          {!isEditing ? (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <strong>Impulse:</strong>
                <p style={{ marginTop: '5px', fontSize: '16px' }}>{impulse.impulseText}</p>
              </div>

              {impulse.trigger && (
                <div style={{ marginBottom: '20px' }}>
                  <strong>Trigger:</strong>
                  <p style={{ marginTop: '5px' }}>{impulse.trigger}</p>
                </div>
              )}

              {impulse.emotion && (
                <div style={{ marginBottom: '20px' }}>
                  <strong>Emotion:</strong>
                  <p style={{ marginTop: '5px' }}>{impulse.emotion}</p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <strong>Did you act on it?</strong>
                <p style={{ marginTop: '5px' }}>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
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
                    {impulse.didAct === 'yes' ? 'Yes' : impulse.didAct === 'no' ? 'No' : 'Unknown'}
                  </span>
                </p>
              </div>

              {impulse.notes && (
                <div style={{ marginBottom: '20px' }}>
                  <strong>Notes:</strong>
                  <p style={{ marginTop: '5px' }}>{impulse.notes}</p>
                </div>
              )}

              <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                <p>Created: {formatDate(impulse.createdAt)}</p>
                {impulse.updatedAt && <p>Updated: {formatDate(impulse.updatedAt)}</p>}
              </div>

              {success && <div className="success">{success}</div>}
              {error && <div className="error">{error}</div>}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsEditing(true)} style={{ flex: 1 }}>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  style={{ flex: 1, backgroundColor: '#dc3545' }}
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="impulseText">Impulse *</label>
                <input
                  id="impulseText"
                  type="text"
                  value={impulseText}
                  onChange={(e) => setImpulseText(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="trigger">Trigger</label>
                <input
                  id="trigger"
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="What triggered this impulse?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emotion">Emotion</label>
                <input
                  id="emotion"
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="How did you feel?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="didAct">Did you act on it? *</label>
                <select
                  id="didAct"
                  value={didAct}
                  onChange={(e) => setDidAct(e.target.value as any)}
                  required
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional thoughts or reflections..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {error && <div className="error">{error}</div>}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadImpulse();
                  }}
                  style={{ flex: 1, backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ImpulseDetail;
