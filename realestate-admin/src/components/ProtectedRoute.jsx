import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession } from '../helpers/auth';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadAuth() {
      const userData = await checkSession();
      setSession({ user: userData});
    }

    loadAuth();
  }, []);

  if (!session) {
    return <div>Loading...</div>
  }

  if (!session.user) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
