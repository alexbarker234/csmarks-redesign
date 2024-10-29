import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchUser } from "./database/db";
import { User } from "./types";

interface AuthContextType {
  isReady: boolean;
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);

  const updateUser = async () => {
    if (cookies.userId) {
      const user = await fetchUser(cookies.userId);
      setUser(user);
      setIsReady(true);
    }
  };

  useEffect(() => {
    updateUser();
  }, [cookies.userId]);

  const login = (userId: string) => {
    updateUser();
    setCookie("userId", userId, { path: "/" });
  };

  const logout = () => {
    setUser(null);
    removeCookie("userId", { path: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        isReady,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
