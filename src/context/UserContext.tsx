
"use client";

import { createContext, useContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null | undefined ; 
};

const UserContext = createContext<User | null>(null);

export default function UserProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
