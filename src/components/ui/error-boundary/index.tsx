/*
 * ErrorBoundary Components
 * 
 * Codeless error handling with context-aware components.
 * 
 * Usage:
 *   <ErrorBoundary fallback={<ErrorFallback />}>
 *     {props.children}
 *   </ErrorBoundary>
 * 
 * ErrorFallback example:
 *   <div>
 *     <ErrorBoundaryResetButton>Reset</ErrorBoundaryResetButton>
 *     An error occurred: <ErrorBoundaryMessage />
 *     Cause: <ErrorBoundaryCause />
 *   </div>
 */

import {
  createContext,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { Show, ErrorBoundary as SolidErrorBoundary } from "solid-js";

// ErrorBoundary Context
// ============================================================================

type ErrorBoundaryContextValue = {
  error: any;
  reset: () => void;
};

const ErrorBoundaryContext = createContext<ErrorBoundaryContextValue>();

const useErrorBoundaryContext = (): ErrorBoundaryContextValue => {
  const ctx = useContext(ErrorBoundaryContext);
  if (!ctx) {
    throw new Error(
      "ErrorBoundary components must be used within ErrorBoundary"
    );
  }
  return ctx;
};

// ErrorBoundary Root
// ============================================================================

type ErrorBoundaryProps = {
  fallback: JSX.Element;
  children: JSX.Element;
};

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  return (
    <SolidErrorBoundary
      fallback={(error, reset) => (
        <ErrorBoundaryContext.Provider value={{ error, reset }}>
          {props.fallback}
        </ErrorBoundaryContext.Provider>
      )}
    >
      {props.children}
    </SolidErrorBoundary>
  );
};

// ErrorBoundaryResetButton
// ============================================================================

type ErrorBoundaryResetButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: JSX.Element;
};

const ErrorBoundaryResetButton = (props: ErrorBoundaryResetButtonProps) => {
  const { reset } = useErrorBoundaryContext();
  const [local, others] = splitProps(props, ["children"]);
  return (
    <button type="button" onClick={reset} {...others}>
      {local.children}
    </button>
  );
};

// ErrorBoundaryMessage
// ============================================================================

type ErrorBoundaryMessageProps = JSX.HTMLAttributes<HTMLSpanElement>;

const ErrorBoundaryMessage = (props: ErrorBoundaryMessageProps) => {
  const { error } = useErrorBoundaryContext();
  return (
    <Show when={error?.message}>
      <span {...props}>{error.message}</span>
    </Show>
  );
};

// ErrorBoundaryCause
// ============================================================================

type ErrorBoundaryCauseProps = JSX.HTMLAttributes<HTMLSpanElement>;

const ErrorBoundaryCause = (props: ErrorBoundaryCauseProps) => {
  const { error } = useErrorBoundaryContext();
  return (
    <Show when={error?.cause}>
      <span {...props}>{error.cause}</span>
    </Show>
  );
};

export {
  ErrorBoundary,
  ErrorBoundaryResetButton,
  ErrorBoundaryMessage,
  ErrorBoundaryCause,
};
