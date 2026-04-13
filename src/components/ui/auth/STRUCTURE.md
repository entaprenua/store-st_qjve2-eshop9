# Auth Components Architecture

## Overview

Zero-code ready authentication components for the visual builder. Components are designed to be fully composable - users compose UI by nesting components without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read/write from context, no manual state management
2. **Composable** - Section primitives that users combine freely
3. **Context-Based** - Uses `AuthContext` for unified form state
4. **Form Auto-Submission** - Forms handle submission automatically

## Directory Structure

```
src/components/ui/auth/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── auth-context.tsx          # Context + useAuthForm hook
├── login-form.tsx            # AuthLoginForm component
├── register-form.tsx         # AuthRegisterForm component
├── email-field.tsx           # AuthEmailField component
├── username-field.tsx         # AuthUsernameField component
├── password-field.tsx         # AuthPasswordField, AuthConfirmPasswordField
├── google-button.tsx          # AuthGoogleButton
├── github-button.tsx         # AuthGithubButton
├── facebook-button.tsx        # AuthFacebookButton
└── error-message.tsx         # AuthErrorMessage
```

## Components

### Form Components

These wrap `AuthProvider` internally:

| Component | Description |
|-----------|-------------|
| `AuthLoginForm` | Login form with auto-submit to `/api/v1/auth/login` |
| `AuthRegisterForm` | Registration form with auto-submit to `/api/v1/auth/register` |

### Section Components

These read from `AuthContext`:

| Component | Description |
|-----------|-------------|
| `AuthEmailField` | Email input field |
| `AuthUsernameField` | Username input field |
| `AuthPasswordField` | Password field with optional strength indicator |
| `AuthConfirmPasswordField` | Confirm password field |
| `AuthGoogleButton` | Google OAuth button |
| `AuthGithubButton` | GitHub OAuth button |
| `AuthFacebookButton` | Facebook OAuth button |
| `AuthErrorMessage` | Shows error when present |

### Context

```typescript
type AuthFormData = {
  email: string
  username: string
  password: string
  confirmPassword: string
  rememberMe: boolean
}

type AuthContextValue = {
  formData: Accessor<AuthFormData>
  setFormData: (data: Partial<AuthFormData>) => void
  resetFormData: () => void
  isLoading: Accessor<boolean>
  setIsLoading: (loading: boolean) => void
  error: Accessor<string | null>
  setError: (error: string | null) => void
  showPassword: Accessor<boolean>
  toggleShowPassword: () => void
  onOAuth: (provider: AuthProvider) => void
  onEmailPassword: (data: { email: string; password: string }) => void
}
```

## Usage Pattern

### Login Form

```tsx
<AuthLoginForm>
  <AuthErrorMessage class="bg-destructive/10 text-destructive p-3 rounded-md">
    Login failed
  </AuthErrorMessage>
  <AuthEmailField />
  <AuthPasswordField showStrength showToggle />
  <Button type="submit">Sign In</Button>
  <AuthGoogleButton />
  <AuthGithubButton />
  <AuthFacebookButton />
</AuthLoginForm>
```

### Register Form

```tsx
<AuthRegisterForm>
  <AuthErrorMessage class="bg-destructive/10 text-destructive p-3 rounded-md">
    Registration failed
  </AuthErrorMessage>
  <AuthEmailField />
  <AuthUsernameField />
  <AuthPasswordField showStrength showToggle />
  <AuthConfirmPasswordField />
  <Button type="submit">Create Account</Button>
  <AuthGoogleButton />
  <AuthGithubButton />
  <AuthFacebookButton />
</AuthRegisterForm>
```

## Component Props

### AuthLoginForm / AuthRegisterForm

```typescript
type AuthLoginFormProps = {
  children?: JSX.Element
}

type AuthRegisterFormProps = {
  children?: JSX.Element
}
```

### AuthEmailField

```typescript
type AuthEmailFieldProps = {
  class?: string
}
```

### AuthUsernameField

```typescript
type AuthUsernameFieldProps = {
  label?: string
  placeholder?: string
  class?: string
}
```

### AuthPasswordField

```typescript
type AuthPasswordFieldProps = {
  label?: string
  placeholder?: string
  showStrength?: boolean
  showToggle?: boolean
  class?: string
}
```

### AuthConfirmPasswordField

```typescript
type AuthConfirmPasswordFieldProps = {
  label?: string
  class?: string
}
```

### AuthGoogleButton / AuthGithubButton / AuthFacebookButton

```typescript
type AuthGoogleButtonProps = {
  label?: string
  class?: string
  children?: JSX.Element
}
```

### AuthErrorMessage

```typescript
type AuthErrorMessageProps = {
  class?: string
  children?: JSX.Element
}
```

## API Endpoints

| Endpoint | Form | Description |
|----------|------|-------------|
| POST `/api/v1/auth/login` | LoginForm | Email/password login |
| POST `/api/v1/auth/register` | RegisterForm | Email/password registration |
| GET `/api/v1/auth/oauth/:provider` | OAuth buttons | Initiate OAuth flow |
