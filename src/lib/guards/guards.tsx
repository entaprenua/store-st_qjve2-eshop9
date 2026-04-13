import { type Component, Show, onMount, createSignal, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from './auth';
import { routes } from '../utils/routes';

interface AuthGuardProps {
  children: JSX.Element;
  redirectTo?: string;
}

export const AuthGuard: Component<AuthGuardProps> = (props) => {
  const navigate = useNavigate();
  const { isAuthenticated, token, refreshUser } = useAuth();
  const [isChecking, setIsChecking] = createSignal(true);

  onMount(async () => {
    if (token() && !isAuthenticated()) {
      await refreshUser();
    }
    setIsChecking(false);
  });

  return (
    <Show when={!isChecking()} fallback={
        <div class="flex items-center justify-center min-h-screen">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">Loading...</div>
        </div>
    }>
      <Show when={isAuthenticated()} fallback={
          <div class="flex flex-col items-center justify-center min-h-screen">
            <p class="text-gray-600 mb-4">Please log in to access this page</p>
            <button
              onClick={() => navigate(props.redirectTo || '/log-in', { replace: true })}
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
      }>
        {props.children}
      </Show>
    </Show>
  );
};

interface GuestGuardProps {
  children: JSX.Element;
  redirectTo?: string;
}

export const GuestGuard: Component<GuestGuardProps> = (props) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Show
      when={!isAuthenticated()}
      fallback={
        <div class="flex flex-col items-center justify-center min-h-screen">
          <p class="text-gray-600 mb-4">You are already logged in</p>
          <button
            onClick={() => navigate(props.redirectTo || '/', { replace: true })}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      }
    >
      {props.children}
    </Show>
  );
};

interface RoleGuardProps {
  children: JSX.Element;
  roles: string[];
  redirectTo?: string;
}

export const RoleGuard: Component<RoleGuardProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasRole = () => {
    const currentUser = user();
    return currentUser && currentUser.role && props.roles.includes(currentUser.role);
  };

  return (
    <Show
      when={hasRole()}
      fallback={
        <div class="flex flex-col items-center justify-center min-h-screen">
          <p class="text-gray-600 mb-4">You don't have permission to access this page</p>
          <button
            onClick={() => navigate(props.redirectTo || '/', { replace: true })}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      }
    >
      {props.children}
    </Show>
  );
};

interface StoreOwnerGuardProps {
  children: JSX.Element;
  storeId: string | (() => string);
  redirectTo?: string;
}

export const StoreOwnerGuard: Component<StoreOwnerGuardProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isOwner = () => {
    const currentUser = user();
    const storeId = typeof props.storeId === 'function' ? props.storeId() : props.storeId;
    return currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STORE_OWNER' || currentUser.id === storeId);
  };

  return (
    <Show
      when={isOwner()}
      fallback={
        <div class="flex flex-col items-center justify-center min-h-screen">
          <p class="text-gray-600 mb-4">You don't have permission to manage this store</p>
          <button
            onClick={() => navigate(props.redirectTo || routes.stores, { replace: true })}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to My Sites
          </button>
        </div>
      }
    >
      {props.children}
    </Show>
  );
};
