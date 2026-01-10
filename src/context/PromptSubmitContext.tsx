"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PromptSubmitContextType = {
  promptChanged: number;
  notifyPromptSubmit: () => void;
};

const PromptSubmitContext = createContext<PromptSubmitContextType | null>(null);

export function PromptSubmitProvider({ children }: { children: ReactNode }) {
  const [promptChanged, setPromptChanged] = useState<number>(0);

  const notifyPromptSubmit = () => {
    setPromptChanged((prev) => prev + 1);
  };

  return (
    <PromptSubmitContext.Provider
      value={{ promptChanged, notifyPromptSubmit }}
    >
      {children}
    </PromptSubmitContext.Provider>
  );
}

export function usePromptSubmit() {
  const context = useContext(PromptSubmitContext);
  if (!context) {
    throw new Error(
      "usePromptSubmit must be used inside PromptSubmitProvider"
    );
  }
  return context;
}
