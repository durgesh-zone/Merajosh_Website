import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/auth.api';
import { onSessionExpired } from '@/lib/api';
import { closeSocket } from '@/lib/socket';
import { readGuestCart, clearGuestCart } from '@/features/cart/guestCart';

const AuthContext = createContext(null);

/** Restores the session on load: /auth/me, falling back to a silent refresh. */
async function loadSession() {
  try {
    return await authApi.me();
  } catch (err) {
    if (err.response?.status !== 401) throw err;
    try {
      return await authApi.refresh();
    } catch {
      return null;
    }
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  // isPending (not isLoading): until the session check answers, we don't know if the user is signed in.
  const { data: user, isPending: isLoading } = useQuery({ queryKey: ['auth', 'me'], queryFn: loadSession, staleTime: Infinity, retry: false });

  const setUser = useCallback((u) => queryClient.setQueryData(['auth', 'me'], u), [queryClient]);

  useEffect(() => onSessionExpired(() => setUser(null)), [setUser]);

  const afterSignIn = useCallback(
    (u) => {
      setUser(u);
      clearGuestCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    [queryClient, setUser],
  );

  const login = useCallback(async (credentials) => {
    const u = await authApi.login({ ...credentials, guestCart: readGuestCart() });
    afterSignIn(u);
    return u;
  }, [afterSignIn]);

  const register = useCallback(async (data) => {
    const u = await authApi.register({ ...data, guestCart: readGuestCart() });
    afterSignIn(u);
    return u;
  }, [afterSignIn]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      closeSocket();
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'auth' });
      setUser(null);
    }
  }, [queryClient, setUser]);

  const value = useMemo(() => ({ user: user || null, isLoading, isAuthenticated: Boolean(user), login, register, logout, setUser }), [user, isLoading, login, register, logout, setUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
