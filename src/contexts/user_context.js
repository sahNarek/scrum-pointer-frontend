import { createContext, useContext } from 'react';

export const UserContext = createContext({
  currentUser: {},
  refetch: null
});

export const useAuth = () => (
  useContext(UserContext)
)