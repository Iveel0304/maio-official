import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users - in a real app, this would be handled by an actual backend
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@maio.mn',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'editor',
    email: 'editor@maio.mn',
    role: 'editor',
    name: 'Editor User'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would be an actual API call
    const foundUser = MOCK_USERS.find(u => u.username === username);
    
    if (foundUser && password === 'password') { // Super secure! 🙃
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};