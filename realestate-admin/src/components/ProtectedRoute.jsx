import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession } from '../helpers/auth';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadAuth() {
      const userData = await checkSession();
      setSession({ user: userData });
    }

    loadAuth();
  }, []);

  if (!session) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <svg className="animate-spin h-14 w-14 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!session.user) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
