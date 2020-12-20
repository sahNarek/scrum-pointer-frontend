import { createContext } from 'react';

const UserContext = createContext({
  currentUser: {}
});

export default UserContext;