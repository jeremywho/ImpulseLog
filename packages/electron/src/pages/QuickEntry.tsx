import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';

function QuickEntry() {
  const { api } = useAuth();
  const [impulseText, setImpulseText] = useState('');
  const [trigger, setTrigger] = useState('');
  const [emotion, setEmotion] = useState('');
  const [didAct, setDidAct] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [notes, setNotes] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    inputRef.current?.focus();

    // Handle ESC key to close window
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!impulseText.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.createImpulse({
        impulseText: impulseText.trim(),
        trigger: trigger.trim() || undefined,
        emotion: emotion.trim() || undefined,
        didAct,
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setImpulseText('');
      setTrigger('');
      setEmotion('');
      setDidAct('unknown');
      setNotes('');
      setShowOptional(false);

      // Close window after short delay
      setTimeout(() => {
        window.close();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save impulse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
          Quick Impulse Entry
        </h2>
        <p style={{ marginTop: 0, marginBottom: '15px', color: '#666', fontSize: '14px' }}>
          Capture your impulse quickly (Press ESC to close)
        </p>

        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="form-group">
            <label htmlFor="impulseText" style={{ fontWeight: 600 }}>
              What's the impulse? *
            </label>
            <input
              ref={inputRef}
              id="impulseText"
              type="text"
              value={impulseText}
              onChange={(e) => setImpulseText(e.target.value)}
              placeholder="e.g., Buy that new gadget, Check social media..."
              required
              autoFocus
              style={{ fontSize: '16px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              style={{
                backgroundColor: 'transparent',
                color: '#007bff',
                border: 'none',
                padding: '5px 0',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline',
              }}
            >
              {showOptional ? '▼ Hide optional fields' : '▶ Add details (optional)'}
            </button>
          </div>

          {showOptional && (
            <div style={{ marginBottom: '15px' }}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="trigger" style={{ fontSize: '14px' }}>Trigger</label>
                <input
                  id="trigger"
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="What triggered this?"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="emotion" style={{ fontSize: '14px' }}>Emotion</label>
                <input
                  id="emotion"
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="How did you feel?"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="didAct" style={{ fontSize: '14px' }}>Did you act on it?</label>
                <select
                  id="didAct"
                  value={didAct}
                  onChange={(e) => setDidAct(e.target.value as any)}
                  style={{ fontSize: '14px', padding: '8px' }}
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label htmlFor="notes" style={{ fontSize: '14px' }}>Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional thoughts..."
                  rows={2}
                  style={{ fontSize: '14px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}
          {success && <div className="success">Saved! Closing...</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button
              type="submit"
              disabled={loading || !impulseText.trim()}
              style={{ flex: 1 }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              style={{
                backgroundColor: '#6c757d',
                flex: 1,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickEntry;
