import './Home.scss';
import { NavBar } from '../../components/NavBar/NavBar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInfos } from '../OAuth/OAuth';

export interface IntraData {
  first_name: string;
  email: string;
  usual_full_name: string;
  image_url: string;
  login: string;
}

export interface ErrResponse {
  statusCode: number;
  message: string;
  error: string;
}

export default function Home() {
  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence'
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  const navigate = useNavigate();

  async function getStoredData() {
    let localStore = window.localStorage.getItem('userData');
    if (!localStore) {
      await getInfos();
      localStore = window.localStorage.getItem('userData');
      if (!localStore)
        return;
    }
    const data: IntraData = JSON.parse(localStore);
    setIntraData(data);
  }

  useEffect(() => {
    getStoredData();
  }, []);

  return (
    <div className="home">
      <NavBar name={intraData.login} imgUrl={intraData.image_url} />
    </div >
  );
}