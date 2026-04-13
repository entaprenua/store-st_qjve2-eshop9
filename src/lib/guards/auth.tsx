import { createContext, useContext, createSignal, onMount, type ParentComponent, type Accessor } from 'solid-js';
import type { User } from '../types/entities';
import { setCsrfToken as setGlobalCsrfToken, getCsrfToken as getGlobalCsrfToken } from '../api/client';

interface AuthContextType {
  user: Accessor<User | null>;
  token: Accessor<string | null>;  // Kept for backward compatibility (tokens now in HttpOnly cookies)
  isAuthenticated: Accessor<boolean>;
  isLoading: Accessor<boolean>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  register: (email: string, password: string, username?: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  getCsrfToken: () => string | null;
}

interface LoginResult {
  success: boolean;
  error?: string;
  errorCode?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  expiresAt?: number;
  csrfToken?: string;
}

const AuthContext = createContext<AuthContextType>();

const CSRF_STORAGE_KEY = 'auth_csrf';

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [token, setToken] = createSignal<string | null>(null);  // Kept for BC, but not used for API
  const [csrfToken, setCsrfToken] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [tokenExpiresAt, setTokenExpiresAt] = createSignal<number | null>(null);

  const isAuthenticated = () => !!user();

  const getCsrfToken = () => csrfToken();

  const fetchApi = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    const token = csrfToken();
    if (token && !path.includes('/login') && !path.includes('/register')) {
      headers.set('X-CSRF-Token', token);
    }
    
    return fetch(`/api/v1${path}`, {
      ...options,
      headers,
      credentials: 'include', // Important: sends cookies with request
    });
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const response = await fetchApi('/auth/refresh', {
        method: 'POST',
      });

      if (!response.ok) {
        return false;
      }

      const data: AuthResponse = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          setGlobalCsrfToken(data.csrfToken);
          sessionStorage.setItem(CSRF_STORAGE_KEY, data.csrfToken);
        }
        if (data.expiresAt) {
          setTokenExpiresAt(data.expiresAt);
        }
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const scheduleTokenRefresh = () => {
    const expiresAt = tokenExpiresAt();
    if (!expiresAt) return;

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const refreshBuffer = 60000; // 1 minute before expiry
    
    if (timeUntilExpiry <= refreshBuffer) {
      refreshAuth();
      return;
    }

    const refreshTime = timeUntilExpiry - refreshBuffer;
    setTimeout(() => {
      refreshAuth();
    }, refreshTime);
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const text = await response.text();
      
      let data: AuthResponse;
      try {
        data = JSON.parse(text);
      } catch {
        return {
          success: false,
          error: 'Server error. Please try again later.',
          errorCode: 'SERVER_ERROR',
        };
      }

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          setGlobalCsrfToken(data.csrfToken);
          sessionStorage.setItem(CSRF_STORAGE_KEY, data.csrfToken);
        }
        if (data.expiresAt) {
          setTokenExpiresAt(data.expiresAt);
          scheduleTokenRefresh();
        }
        return { success: true };
      }

      return {
        success: false,
        error: data.success === false ? (data as any).message || 'Login failed' : 'Unknown error',
        errorCode: 'LOGIN_FAILED',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        errorCode: 'NETWORK_ERROR',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username?: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      });

      const text = await response.text();
      
      let data: AuthResponse;
      try {
        data = JSON.parse(text);
      } catch {
        return {
          success: false,
          error: 'Server error. Please try again later.',
          errorCode: 'SERVER_ERROR',
        };
      }

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          setGlobalCsrfToken(data.csrfToken);
          sessionStorage.setItem(CSRF_STORAGE_KEY, data.csrfToken);
        }
        if (data.expiresAt) {
          setTokenExpiresAt(data.expiresAt);
          scheduleTokenRefresh();
        }
        return { success: true };
      }

      return {
        success: false,
        error: data.success === false ? (data as any).message || 'Registration failed' : 'Unknown error',
        errorCode: 'REGISTRATION_FAILED',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        errorCode: 'NETWORK_ERROR',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetchApi('/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setCsrfToken(null);
      setGlobalCsrfToken(null);
      setTokenExpiresAt(null);
      sessionStorage.removeItem(CSRF_STORAGE_KEY);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await fetchApi('/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        }
      } else if (response.status === 401) {
        const refreshed = await refreshAuth();
        if (!refreshed) {
          setUser(null);
        }
      }
    } catch {
      // Network error, keep current state
    }
  };

  onMount(async () => {
    const storedCsrf = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (storedCsrf) {
      setCsrfToken(storedCsrf);
      setGlobalCsrfToken(storedCsrf);
    }

    try {
      const refreshed = await refreshAuth();
      if (refreshed) {
        scheduleTokenRefresh();
      } else {
        const response = await fetchApi('/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUser(data.data);
          }
        }
      }
    } catch {
      // Not authenticated
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,  // Kept for backward compatibility
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        refreshAuth,
        getCsrfToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
