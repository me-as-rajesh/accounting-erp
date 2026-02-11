import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="container">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
