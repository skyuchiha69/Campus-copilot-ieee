import { StudentProfile, UserRole } from '../types';
import { MOCK_STUDENT } from './mockData';
import { ApiClient } from './apiClient';

export interface AuthState {
  user: StudentProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  token: string | null;
}

const STORAGE_USER_KEY = 'campus_copilot_user';
const STORAGE_ROLE_KEY = 'campus_copilot_role';

export const authService = {
  getCurrentSession(): AuthState {
    const savedUser = sessionStorage.getItem(STORAGE_USER_KEY);
    const savedRole = (sessionStorage.getItem(STORAGE_ROLE_KEY) as UserRole) || 'student';
    const token = ApiClient.getAuthToken();

    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        ApiClient.setAuthSession(token, savedRole, user.studentId || 'CS2023-8842');
        return {
          user,
          role: savedRole,
          isAuthenticated: true,
          token,
        };
      } catch (e) {
        // Fallback to default
      }
    }

    // Default authenticated session
    const defaultToken = 'jwt_session_token_dharm_2026';
    ApiClient.setAuthSession(defaultToken, 'student', MOCK_STUDENT.studentId);
    return {
      user: MOCK_STUDENT,
      role: 'student',
      isAuthenticated: true,
      token: defaultToken,
    };
  },

  async login(identifier: string, pass: string, role: UserRole = 'student'): Promise<AuthState> {
    try {
      // 1. Attempt real API authentication with backend
      const res = await ApiClient.request<{ token: string; user: any; profile?: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: identifier, password: pass }),
      });

      if (res.success && res.data) {
        const { token, user } = res.data;
        const userProfile: StudentProfile = {
          ...MOCK_STUDENT,
          name: user.name || identifier,
          studentId: user.student_id || (user.role === 'admin' ? 'ADMIN-9901' : 'CS2023-8842'),
          program: user.program || 'B.Tech Computer Science & Engineering',
          department: user.department || 'Computer Science & Engineering',
        };

        ApiClient.setAuthSession(token, user.role, userProfile.studentId);
        sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userProfile));
        sessionStorage.setItem(STORAGE_ROLE_KEY, user.role);

        return {
          user: userProfile,
          role: user.role,
          isAuthenticated: true,
          token,
        };
      }
    } catch {
      // If backend offline, gracefully fall back to local dev session
    }

    // Fallback for offline / local prototype demo mode
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user: StudentProfile = {
      ...MOCK_STUDENT,
      name: role === 'admin'
        ? 'Administrator (Dean Office)'
        : role === 'instructor'
        ? 'Prof. Ramesh Kulkarni'
        : identifier.includes('@')
        ? identifier.split('@')[0]
        : identifier || 'Dharm Vaghela',
      studentId: role === 'admin' ? 'ADMIN-9901' : role === 'instructor' ? 'FAC-301' : 'CS2023-8842',
    };

    const token = `jwt_token_${role}_${Date.now()}`;
    ApiClient.setAuthSession(token, role, user.studentId);
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(STORAGE_ROLE_KEY, role);

    return {
      user,
      role,
      isAuthenticated: true,
      token,
    };
  },

  async loginSSO(provider: 'google' | 'university_sso'): Promise<AuthState> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const user: StudentProfile = { ...MOCK_STUDENT };
    const token = `sso_jwt_token_${provider}_${Date.now()}`;
    ApiClient.setAuthSession(token, 'student', user.studentId);

    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(STORAGE_ROLE_KEY, 'student');

    return {
      user,
      role: 'student',
      isAuthenticated: true,
      token,
    };
  },

  async logout(): Promise<void> {
    try {
      await ApiClient.request('/auth/logout', { method: 'POST' });
    } catch {
      // Continue client cleanup
    }
    ApiClient.setAuthSession(null);
    sessionStorage.removeItem(STORAGE_USER_KEY);
    sessionStorage.removeItem(STORAGE_ROLE_KEY);
  },

  async switchRole(role: UserRole): Promise<AuthState> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const token = `jwt_token_${role}_${Date.now()}`;
    const user: StudentProfile = {
      ...MOCK_STUDENT,
      name: role === 'admin'
        ? 'Administrator (Dean Office)'
        : role === 'instructor'
        ? 'Prof. Ramesh Kulkarni'
        : 'Dharm Vaghela',
      studentId: role === 'admin' ? 'ADMIN-9901' : role === 'instructor' ? 'FAC-301' : 'CS2023-8842',
    };

    ApiClient.setAuthSession(token, role, user.studentId);
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    sessionStorage.setItem(STORAGE_ROLE_KEY, role);

    return {
      user,
      role,
      isAuthenticated: true,
      token,
    };
  }
};
