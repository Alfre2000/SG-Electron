import { createContext, useContext, Context } from "react";
import { ProgrammiNames } from "../programmi";

export interface UserContextType {
  user: {
    user: {
      id: number;
      impianto: {
        id: number;
      } | null;
      is_staff: boolean;
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

export const useImpianto = () => {
  const context = useUserContext();
  return context.user?.user?.impianto?.id;
};
