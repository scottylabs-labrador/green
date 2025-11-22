import { createContext, useContext, useState } from "react";

const EmailContext = createContext<{
  email: string;
  setEmail: (email: string) => void;
}>({ email: "", setEmail: () => {} });

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState("");
  return <EmailContext.Provider value={{ email, setEmail }}>{children}</EmailContext.Provider>
}

export const useEmail = () => useContext(EmailContext);