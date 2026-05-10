import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { LoginPayload, RegisterPayload, User } from "../types/auth";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../services/authService";

const AUTH_SESSION_KEY = "manole_tasks_has_session";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasTriedToRestoreSession = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setError(null);

    try {
      const response = await login(payload);

      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem(AUTH_SESSION_KEY, "true");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível fazer login.";

      setError(message);
      throw err;
    }
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    setError(null);

    try {
      const response = await register(payload);

      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem(AUTH_SESSION_KEY, "true");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível criar a conta.";

      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(AUTH_SESSION_KEY);
      setError(null);
    }
  }, []);

  useEffect(() => {
    if (hasTriedToRestoreSession.current) {
      return;
    }

    hasTriedToRestoreSession.current = true;

    async function restoreSession() {
      const hasPreviousSession =
        localStorage.getItem(AUTH_SESSION_KEY) === "true";

      if (!hasPreviousSession) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await refreshAccessToken();

        setUser(response.user);
        setAccessToken(response.accessToken);
      } catch {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem(AUTH_SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      clearError,
    }),
    [user, accessToken, isLoading, error, signIn, signUp, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
