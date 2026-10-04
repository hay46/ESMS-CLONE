import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { observeSession, saveProfile } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeSession((next) => {
      setProfile(next);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateProfile = useCallback(
    async (patch) => {
      const next = await saveProfile(profile, patch);
      setProfile(next);
      return next;
    },
    [profile],
  );

  const value = useMemo(
    () => ({ profile, loading, setProfile, updateProfile }),
    [profile, loading, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}