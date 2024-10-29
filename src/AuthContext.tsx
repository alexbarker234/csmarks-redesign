import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { User } from "./types";

interface AuthContextType {
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
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);

  useEffect(() => {
    if (cookies.userId) {
      setUser({
        firstName: "Example",
        lastName: "Person",
        id: cookies.userId
      });
    }
  }, [cookies.userId]);

  const login = (userId: string) => {
    setUser({ firstName: "Example", lastName: "Person", id: userId });
    setCookie("userId", userId, { path: "/" });
  };

  const logout = () => {
    setUser(null);
    removeCookie("userId", { path: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
