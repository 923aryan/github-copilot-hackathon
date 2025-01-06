import callApi, { getAuthToken, removeAuthToken, setAuthToken } from '@/utils/utils';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const token = getAuthToken();
    const checkAuthentication = async () => {
      if (token) {
        try {
          const profile = await fetchUserProfile();
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  const login = (jwt: string) => {
    setAuthToken(jwt);
    setIsAuthenticated(true);
    setUser({});
    fetchUserProfile().then(profile => {
      if (profile) setUser(profile);
    });
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await callApi<{ id: number; username: string }>({
        endpoint: '/api/profile',
        method: 'GET',
      });
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error; // Let the caller handle this error
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};