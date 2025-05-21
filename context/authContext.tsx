"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { createClient } from "@/lib/supabase";

type UserType = {
  name: string;
  email: string;
  avatarUrl?: string;
  uid :string
};

type UserContextType = {
  user: UserType | null;
  handleLogout: () => Promise<void>;
};

const authContext = createContext<UserContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (currentUser) {
        const name =
          currentUser.user_metadata?.name ||
          currentUser.email?.split("@")[0] ||
          "Unknown";

        const avatarUrl = currentUser.user_metadata?.avatar_url || "";

        setUser({
          uid: currentUser.id,
          name,
          email: currentUser.email || "unknown@example.com",
          avatarUrl,
        });
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = "/login";
  };

  return (
    <authContext.Provider value={{ user, handleLogout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
