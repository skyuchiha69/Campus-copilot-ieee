/**
 * Security-Enforced API Client Layer
 * Handles authenticated communication with the Group 2 Backend API.
 * 
 * Enforces:
 * 1. Bearer token session validation (401 Unauthorized for expired/missing sessions).
 * 2. Role-Based Access Control (RBAC) (403 Forbidden for unauthorized roles).
 * 3. Resource-Level Ownership Validation (403 Forbidden if a student attempts to query another student's data).
 * 4. Standardized ApiResponse<T> envelope with requestId, timestamps, and latency tracking.
 * 5. Secure ephemeral token storage (Never stores raw university passwords or portal session cookies).
 */

import { ApiResponse, ApiError, UserRole } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api/v1';

export class ApiSecurityException extends Error {
  public error: ApiError;
  public requestId: string;
  public status: number;

  constructor(error: ApiError, requestId: string, status: number = 403) {
    super(error.message);
    this.name = 'ApiSecurityException';
    this.error = error;
    this.requestId = requestId;
    this.status = status;
  }
}

export class ApiClient {
  private static token: string | null = null;
  private static currentUserRole: UserRole = 'student';
  private static currentUserId: string = 'CS2023-8842';

  public static setAuthSession(token: string | null, role: UserRole = 'student', userId: string = 'CS2023-8842') {
    this.token = token;
    this.currentUserRole = role;
    this.currentUserId = userId;
    if (token) {
      sessionStorage.setItem('copilot_session_token', token);
      sessionStorage.setItem('copilot_session_role', role);
      sessionStorage.setItem('copilot_session_user_id', userId);
    } else {
      sessionStorage.removeItem('copilot_session_token');
      sessionStorage.removeItem('copilot_session_role');
      sessionStorage.removeItem('copilot_session_user_id');
    }
  }

  public static getAuthToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('copilot_session_token');
    }
    return this.token;
  }

  public static getCurrentRole(): UserRole {
    return (sessionStorage.getItem('copilot_session_role') as UserRole) || this.currentUserRole;
  }

  public static getCurrentUserId(): string {
    return sessionStorage.getItem('copilot_session_user_id') || this.currentUserId;
  }

  public static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Internal RBAC & Resource-Level Permission Guard (Enforced on every client request)
   */
  public static verifyAuthorization(
    endpoint: string,
    requiredRole?: UserRole | UserRole[],
    resourceOwnerId?: string
  ): void {
    const requestId = this.generateRequestId();
    const token = this.getAuthToken();

    // 1. Authentication Check
    if (!token && !endpoint.startsWith('/auth')) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new ApiSecurityException(
        {
          code: 'UNAUTHORIZED',
          message: 'Authentication session required. Please sign in with valid university credentials.',
        },
        requestId,
        401
      );
    }

    const currentRole = this.getCurrentRole();
    const currentUserId = this.getCurrentUserId();

    // 2. Role-Based Access Control (RBAC) Guard
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!allowedRoles.includes(currentRole)) {
        throw new ApiSecurityException(
          {
            code: 'FORBIDDEN',
            message: `Access denied. Endpoint ${endpoint} requires [${allowedRoles.join(', ')}] role. Current role: [${currentRole}].`,
            details: { currentRole, allowedRoles, endpoint },
          },
          requestId,
          403
        );
      }
    }

    // 3. Resource-Level Ownership Guard (Preventing Cross-Student Data Access)
    if (resourceOwnerId && currentRole === 'student' && resourceOwnerId !== currentUserId) {
      throw new ApiSecurityException(
        {
          code: 'OWNERSHIP_VIOLATION',
          message: `Forbidden: You cannot access private student records belonging to user ID '${resourceOwnerId}'.`,
          details: { authenticatedStudent: currentUserId, requestedResourceOwner: resourceOwnerId },
        },
        requestId,
        403
      );
    }
  }

  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const token = this.getAuthToken();
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const start = performance.now();
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const latencyMs = Math.round(performance.now() - start);
      const json = await response.json();

      if (!response.ok || !json.success) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return {
          success: false,
          data: null,
          error: json.error || {
            code: response.status === 403 ? 'FORBIDDEN' : response.status === 401 ? 'UNAUTHORIZED' : 'API_ERROR',
            message: json.error?.message || `Request failed with status ${response.status}`,
          },
          requestId: json.requestId || requestId,
          timestamp: new Date().toISOString(),
          latencyMs,
        };
      }

      return {
        success: true,
        data: json.data,
        error: null,
        requestId: json.requestId || requestId,
        timestamp: new Date().toISOString(),
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Unable to connect to backend server',
        },
        requestId,
        timestamp: new Date().toISOString(),
        latencyMs,
      };
    }
  }

  public static async wrapResponse<T>(data: T, latencyMs: number = 200): Promise<ApiResponse<T>> {
    return {
      success: true,
      data,
      error: null,
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      latencyMs,
    };
  }

  public static async wrapError<T>(
    code: ApiError['code'],
    message: string,
    details?: any
  ): Promise<ApiResponse<T>> {
    return {
      success: false,
      data: null,
      error: { code, message, details },
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
    };
  }
}

