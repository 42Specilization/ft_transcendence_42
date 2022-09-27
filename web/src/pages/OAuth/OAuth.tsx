import { useEffect } from 'react';
import useAuth from '../../auth/auth';
import './OAuth.scss';



export default function OAuth() {

  const { login } = useAuth();

  useEffect(() => {
    login();
  }, []);

  return (
    <h1>hello</h1>
  );
}