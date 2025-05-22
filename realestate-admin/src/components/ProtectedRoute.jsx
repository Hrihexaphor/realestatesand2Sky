import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../providers/SessionProvider';
import LoaderComponent from './LoaderComponent';
import { useMemo } from 'react';
import { USER_ROLES } from '../config';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();
  const location = useLocation();

  const currentPath = location.pathname;
 
  const isAllowed = useMemo(() => {
    if(session?.user?.role === USER_ROLES.ADMIN) return true;
    return (session?.user?.permissions ?? [])?.some((allowedPath) => currentPath.startsWith(allowedPath))
  }, [session, currentPath]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (!session?.user) {
    return <Navigate to="/admin/login" />;
  }

  if (!isAllowed) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500">403 - Forbidden</h1>
          <p className="text-gray-600 mt-2">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
