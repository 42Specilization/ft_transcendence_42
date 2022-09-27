import { createContext, useContext, useState } from 'react';

interface UserType {
  auth: boolean;
  login: () => Promise<unknown>;
  logout: () => Promise<unknown>;
}

const DEFAULT_VALUE = {
  auth: false,
  login: () => { return new Promise(() => { return; }); },
  logout: () => { return new Promise(() => { return; }); }
};

const AuthContext = createContext<UserType>(DEFAULT_VALUE);

function useAuth() {
  const [auth, setAuth] = useState<boolean>(false);

  return {
    auth,
    login() {
      return new Promise((res) => {
        setAuth(true);
        res('login');
      });
    },
    logout() {
      return new Promise((res) => {
        setAuth(false);
        res('logout');
      });
    }
  };
}

export function AuthProvider({ children }: any) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth} > {children} </AuthContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(AuthContext);
}