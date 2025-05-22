import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../helpers/auth';

const SessionContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionContext);

const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const userData = await checkSession();
      setSession({ user: userData });
      setLoading(false);
    }

    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;