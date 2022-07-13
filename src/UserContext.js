import { createContext, useContext } from 'react';

const UserContext = createContext();
export default UserContext;
export const useUserContext = () => useContext(UserContext);
