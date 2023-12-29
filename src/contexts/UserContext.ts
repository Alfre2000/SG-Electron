import { createContext, useContext, Context } from "react";
import { ProgrammiNames } from "../programmi";

export interface UserContextType {
  user: {
    user: {
      username: string;
      programmi: ProgrammiNames[];
    };
  };
}

export const UserContext: Context<UserContextType | null> = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
