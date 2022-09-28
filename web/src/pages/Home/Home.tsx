import './Home.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import { useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
}

interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}

export default function Home() {

  const [name, setName] = useState<string>('Profile');
  const [imgUrl, setimgUrl] = useState<string>('Profile');
  const navigate = useNavigate();

  async function getInfos() {
    const token = window.localStorage.getItem('token');
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // };
    console.log('opa');
    await axios(`http://localhost:3000/auth/me/${token}`).then(response => {
      const data = response.data as IntraData;
      setName(data.login);
      setimgUrl(data.image_url);
      return (data);
    }).catch(err => {
      const data = err.response.data as ErrResponse;
      // if (data.statusCode == 401)
      //   navigate('/signin');
    }

    );
  }

  useEffect(() => {
    getInfos();
  }, []);

  return (
    <div className="home">
      <NavBar name={name} imgUrl={imgUrl} />
    </div >
  );
}