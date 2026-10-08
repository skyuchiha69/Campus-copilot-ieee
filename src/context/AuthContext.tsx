import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, UserRole } from '../types';
import { authService, AuthState } from '../services/auth';

interface AuthContextType extends AuthState {
  login: (identifier: string, pass: string, role?: UserRole) => Promise<void>;
  loginSSO: (provider: 'google' | 'university_sso') => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(authService.getCurrentSession());

  const login = async (identifier: string, pass: string, role: UserRole = 'student') => {
    const nextState = await authService.login(identifier, pass, role);
    setState(nextState);
  };

  const loginSSO = async (provider: 'google' | 'university_sso') => {
    const nextState = await authService.loginSSO(provider);
    setState(nextState);
  };

  const logout = async () => {
    await authService.logout();
    setState({
      user: null,
      role: 'student',
      isAuthenticated: false,
      token: null,
    });
  };

  const switchRole = async (role: UserRole) => {
    const nextState = await authService.switchRole(role);
    setState(nextState);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginSSO,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
