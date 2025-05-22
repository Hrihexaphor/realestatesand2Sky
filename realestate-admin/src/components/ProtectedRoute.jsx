import { Navigate } from 'react-router-dom';
import { useSession } from '../providers/SessionProvider';
import LoaderComponent from './LoaderComponent';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useSession();

  if (loading) {
    return <LoaderComponent/>
  }

  if (!session?.user) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
