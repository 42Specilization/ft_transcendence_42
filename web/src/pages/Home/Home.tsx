import './Home.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
}

export default function Home() {

  const [name, setName] = useState<string>('Profile');
  const [imgUrl, setimgUrl] = useState<string>('Profile');


  useEffect(() => {
    const token = window.localStorage.getItem('token');
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // };

    const data = axios(`http://localhost:3000/auth/me/${token}`).then(response => {
      const data = response.data as IntraData;
      setName(data.login);
      setimgUrl(data.image_url);
    });
    console.log(data);
  }, []);

  return (
    <div className="home">
      <NavBar name={name} imgUrl={imgUrl} />
    </div >
  );
}