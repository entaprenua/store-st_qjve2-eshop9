export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiError | null;
  timestamp: number;
  path: string | null;
}

export type ApiSuccess<T> = Omit<ApiResponse<T>, 'success' | 'data'> & { success: true; data: T };

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string> | null;
  fieldErrors: FieldError[] | null;
}

export interface FieldError {
  field: string;
  message: string;
  value: string | null;
}

export interface PagedRequest {
  page: number;
  size: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

export interface PagedResponse<T> {
  content: T[];
  mode: "offset" | "cursor";
  page: number | null;
  size: number | null;
  totalElements: number | null;
  totalPages: number | null;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  user: import('./entities').User
  expiresAt: number | null
  csrfToken: string | null
}

export interface RegisterRequest {
  email: string
  password: string
  username?: string
  confirmPassword?: string
}

export interface RegisterResponse {
  success: boolean
  user: import('./entities').User
  expiresAt: number | null
  csrfToken: string | null
}

export interface PasswordResetRequestRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface EmailVerificationRequest {
  token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  username?: string
  email?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresAt: string
}

export interface AuthState {
  user: import('./entities').User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface MediaUploadResponse {
  success: boolean;
  storeId: string;
  totalFiles: number;
  successful: number;
  failed: number;
  urls: string[];
  errors: MediaUploadError[] | null;
}

export interface MediaUploadError {
  filename: string;
  error: string;
}

export interface StorageStats {
  storeId: string;
  totalSizeBytes: number;
  totalSizeMB: number;
  totalSizeGB: number;
  totalFiles: number;
  imageCount: number;
  videoCount: number;
  audioCount: number;
  documentCount: number;
}

export interface StoreBuilderUploadResponse {
  success: boolean;
  storeId: string;
  filesProcessed: number;
  errors: string[] | null;
}
