/**
 * LIS v2.0 - Auth API Client
 */

import type { AuthUser, LoginRequest, LoginResponse } from '../types/lis-v2';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('lis_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  /**
   * Login with email/password
   */
  login: (data: LoginRequest) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Logout
   */
  logout: () =>
    apiFetch<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),

  /**
   * Get current user
   */
  me: () =>
    apiFetch<AuthUser>('/auth/me'),

  /**
   * Refresh token
   */
  refresh: () =>
    apiFetch<{ token: string; expires_at: string }>('/auth/refresh', {
      method: 'POST',
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) =>
    apiFetch<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, new_password: string) =>
    apiFetch<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password }),
    }),

  /**
   * Change password (authenticated)
   */
  changePassword: (current_password: string, new_password: string) =>
    apiFetch<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password, new_password }),
    }),
};

export default authApi;
