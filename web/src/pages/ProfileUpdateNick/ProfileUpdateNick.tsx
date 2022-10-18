import { useEffect, useState } from 'react';
import { NavBar } from '../../components/NavBar/NavBar';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { IntraData } from '../../Interfaces/interfaces';
import { getInfos } from '../OAuth/OAuth';
import './ProfileUpdateNick.scss';

export default function ProfileUpdateNick(){
  const defaultIntra: IntraData = {
    email: 'ft_transcendence@gmail.com',
    first_name: 'ft',
    image_url: 'nop',
    login: 'PingPong',
    usual_full_name: 'ft_transcendence'
  };

  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

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

  // async function handleChangeNick() {

  // }


  return (
    <>
      <div className="profileChange">
        <NavBar name={intraData.login} imgUrl={intraData.image_url} />
        <img className="profileChange__userImage" src={intraData.image_url} alt="User Image" />
        <div>
          <div className="profileChange__inputText">
            <strong>Digite o novo usuario:</strong>
          </div>
          <div className="profileChange__inputArea">
            <input type="text"></input>
          </div>
          <div>
            <button
              className="profileChange__inputButton"
              onClick={() => console.log('Hello')}
            >
              Enviar
            </button>
          </div>
        </div>
      </div >
    </>
  );
}
