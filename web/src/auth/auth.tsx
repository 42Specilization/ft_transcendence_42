import axios from 'axios';
import { createContext, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface UserType {
  login: () => Promise<unknown>;
  logout: () => void;
}

const DEFAULT_VALUE = {
  login: () => { return new Promise(() => { return; }); },
  logout: () => { return; }
};

interface AccessTokenResponse {
  access_token: string;
}

const AuthContext = createContext<UserType>(DEFAULT_VALUE);

function useAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return {
    async login() {
      const token = await axios(`http://${import.meta.env.VITE_API_HOST}:3000/auth/code/${searchParams.get('code')}`).then(
        response => {
          return (response.data as AccessTokenResponse);
        }
      ).catch(err => {
        console.log('erro no login aq', err.data);
      });
      console.log(token);
      if (!token) {
        if (process.env.NODE_ENV == 'production')
          return (navigate('/signin'));
        return;
      }
      window.localStorage.setItem('token', token.access_token);
      navigate('/');

    },
    logout() {

      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userData');
      navigate('/signin');
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AuthProvider({ children }: any) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default function AuthConsumer() {
  return useContext(AuthContext);
}
