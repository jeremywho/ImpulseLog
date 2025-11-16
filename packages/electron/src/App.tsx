import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Account from './pages/Account';
import Settings from './pages/Settings';
import QuickEntry from './pages/QuickEntry';
import ImpulseList from './pages/ImpulseList';
import ImpulseDetail from './pages/ImpulseDetail';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container"><h2>Loading...</h2></div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container"><h2>Loading...</h2></div>;
  }

  return !user ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/quick-entry"
        element={
          <PrivateRoute>
            <QuickEntry />
          </PrivateRoute>
        }
      />
      <Route
        path="/impulses"
        element={
          <PrivateRoute>
            <ImpulseList />
          </PrivateRoute>
        }
      />
      <Route
        path="/impulses/:id"
        element={
          <PrivateRoute>
            <ImpulseDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
