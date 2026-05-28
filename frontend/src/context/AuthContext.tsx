import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
  updateCurrentUser,
  type User,
} from '../api/auth';

interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  isAdmin: boolean;
  role: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Pick<User, 'name' | 'about' | 'avatarUrl'>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const withMetadata = (user: User): User => ({
  ...user,
  user_metadata: {
    full_name: user.name,
    role: user.role,
    about: user.about,
    avatar_url: user.avatarUrl,
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [role, setRole]       = useState('Ranger');

  const setAuthState = (token: string, nextUser: User) => {
    const normalizedUser = withMetadata(nextUser);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setSession({ access_token: token, user: normalizedUser });
    setRole(normalizedUser.role);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (!token) {
      setIsLoaded(true);
      return;
    }

    if (storedUser) {
      const parsedUser = withMetadata(JSON.parse(storedUser));
      setUser(parsedUser);
      setSession({ access_token: token, user: parsedUser });
      setRole(parsedUser.role);
    }

    getCurrentUser()
      .then(({ user }) => setAuthState(token, user))
      .catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);
        setSession(null);
        setRole('Ranger');
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    setAuthState(token, user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token, user } = await registerRequest(name, email, password);
    setAuthState(token, user);
  };

  const updateProfile = async (data: Pick<User, 'name' | 'about' | 'avatarUrl'>) => {
    const { user: updatedUser } = await updateCurrentUser(data);
    const token = localStorage.getItem('authToken');
    if (token) setAuthState(token, updatedUser);
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setSession(null);
    setRole('Ranger');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoaded,
      isAdmin: role === 'Administrator',
      role,
      signIn,
      signUp,
      updateProfile,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
