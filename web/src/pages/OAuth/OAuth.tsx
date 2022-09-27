import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../auth/auth';
import './OAuth.scss';

export default function OAuth() {

  const navigate = useNavigate();
  const { login, auth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {

    login().then((data) => {
      console.log(data);
      console.log(searchParams.get('code'));

      // navigate('/');
    });
  }, []);

  return (
    <h1>hello</h1>
  );
}