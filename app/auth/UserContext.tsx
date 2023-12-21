import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';


export const UserContext = createContext<{
  user: any; // Specify a more accurate type if possible
  setUser: React.Dispatch<React.SetStateAction<any>>; // Adjust the type according to your user object
}>({
  user: null,
  setUser: () => {}
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
