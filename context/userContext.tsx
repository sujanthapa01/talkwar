'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase';

type UserType = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type UserContextType = {
  user: UserType | null;
  handleLogout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (currentUser) {
        const name =
          currentUser.user_metadata?.name ||
          currentUser.email?.split('@')[0] ||
          'Unknown';

        const avatarUrl = currentUser.user_metadata?.avatar_url || '';

        setUser({
          name,
          email: currentUser.email || 'unknown@example.com',
          avatarUrl,
        });
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/login';
  };

  return (
    <UserContext.Provider value={{ user, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context){
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
