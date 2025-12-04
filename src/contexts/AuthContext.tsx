import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, HealthProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  healthProfile: HealthProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateHealthProfile: (profile: Omit<HealthProfile, 'userId'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('airsense_user');
    const storedProfile = localStorage.getItem('airsense_health_profile');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setHealthProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: User = {
      _id: 'user_' + Date.now(),
      name: email.split('@')[0],
      email,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('airsense_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      _id: 'user_' + Date.now(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('airsense_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setHealthProfile(null);
    localStorage.removeItem('airsense_user');
    localStorage.removeItem('airsense_health_profile');
  };

  const updateHealthProfile = (profile: Omit<HealthProfile, 'userId'>) => {
    if (!user) return;
    
    const fullProfile: HealthProfile = {
      ...profile,
      userId: user._id,
    };
    
    setHealthProfile(fullProfile);
    localStorage.setItem('airsense_health_profile', JSON.stringify(fullProfile));
  };

  return (
    <AuthContext.Provider value={{
      user,
      healthProfile,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateHealthProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
