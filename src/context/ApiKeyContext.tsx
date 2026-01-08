'use client'; 

import { createContext, useContext, useState, ReactNode } from "react";


type ContextType = {
  isApiKey: boolean;
  setIsApiKey: React.Dispatch<React.SetStateAction<boolean>>;
};


const MyContext = createContext<ContextType | undefined>(undefined);


type ProviderProps = {
  children: ReactNode;
};

export function ApiKeyProvider({ children }: ProviderProps) {
  const [isApiKey, setIsApiKey] = useState<boolean>(false);

  return (
    <MyContext.Provider value={{ isApiKey, setIsApiKey }}>
      {children}
    </MyContext.Provider>
  );
}


export function useMyContext(): ContextType {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("useMyContext must be used inside MyProvider");
  }

  return context;
}
