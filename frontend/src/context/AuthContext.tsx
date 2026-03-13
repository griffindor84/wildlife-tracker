import { createContext, useContext, ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

interface AuthContextType {
  userId: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;
  isAuthenticated: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useClerkAuth();

  return (
    <AuthContext.Provider value={{
      userId:          user?.id,
      email:           user?.primaryEmailAddress?.emailAddress,
      name:            user?.fullName,
      isAuthenticated: !!isSignedIn,
      isLoaded,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};