import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../helpers/auth';

const SessionContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

   const refreshSession = async () => {
    setLoading(true);
    const userData = await checkSession();
    setSession({ user: userData });
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;