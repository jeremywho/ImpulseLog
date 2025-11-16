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
        <h2>Starter Template</h2>
        <div className="nav-links">
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
          <p>This is your home page. You're successfully logged in.</p>
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
        </div>
      </div>
    </>
  );
}

export default Home;
