import { createContext } from 'react';

const UserContext = createContext({
  currentUser: {},
  refetch: null
});

export default UserContext;