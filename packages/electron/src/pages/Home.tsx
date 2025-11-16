import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="nav">
        <h2>ImpulseLog</h2>
        <div className="nav-links">
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
        <div className="card">
          <h1>Welcome, {user?.username}!</h1>
          <p>Track your impulses and build awareness of your patterns.</p>
          {user?.fullName && (
            <p>
              <strong>Full Name:</strong> {user.fullName}
            </p>
          )}
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Member since:</strong>{' '}
            {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
          </p>

          <div style={{ marginTop: '30px' }}>
            <h3>Quick Actions</h3>
            <p style={{ marginBottom: '15px', color: '#666' }}>
              Press <strong>Ctrl+Shift+I</strong> anywhere to quickly log an impulse
            </p>
            <button
              onClick={() => navigate('/impulses')}
              style={{ marginRight: '10px' }}
            >
              View All Impulses
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
