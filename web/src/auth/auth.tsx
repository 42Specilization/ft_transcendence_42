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
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

const AuthContext = createContext<UserType>(DEFAULT_VALUE);

function useAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return {
    async login() {
      console.log(searchParams.get('code'));
      const token = await axios(`http://localhost:3000/auth/code/${searchParams.get('code')}`).then(
        response => {
          return (response.data as AccessTokenResponse);
        }
      ).catch(err => {
        console.log(err.data);
      });

      if (!token)
        return;
      // return (navigate('/signin'));
      // change after
      window.localStorage.setItem('token', token.access_token);
      navigate('/');

    },
    logout() {

      window.localStorage.removeItem('token');
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