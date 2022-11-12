import './Notifications.scss';
import { Bell } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { NotificationChallenge } from './NotificationChallenge/NotificationChallenge';
import { NotificationFriend } from './NotificationFriend/NotificationFriend';
import { NotificationMessage } from './NotificationMessage/NotificationMessage';
import axios from 'axios';
import { defaultIntra, getStoredData } from '../../utils/utils';
import { IntraData } from '../../Interfaces/interfaces';

interface Notification {
  destination_nick: string;
  id: string;
  sender_nick: string;
  type: string;
}
interface NotificationsProps {
  currentStateStatus: any;
}

export function Notifications({ currentStateStatus }: NotificationsProps) {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleOutsideClick(e: any, id: string) {
    console.log('aqui');
    if (e.target.id == id) {
      setNotificationVisible(false);
    }
  }

  async function getUserNotifications(login: string): Promise<[] | null> {
    const token = window.localStorage.getItem('token');
    getStoredData(setIntraData);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(login);

    const data = {
      user_login: login,
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });
    try {
      await api.patch('/notification/userNotifications', data, config)
        .then((result) => {
          // console.log('result', result.data);
          setNotifications(result.data);
          return result.data;

        });
    } catch (err) {
      // throw new
    }
    return null;
  }

  // const defaultNotification : Notification = {
  //   destination_id :'',
  //   id:'',
  //   send_id:'',
  //   type:''
  // };

  const [notifications, setNotifications] = useState<Notification[]>();
  // const notification = getUserNotifications() ;

  useEffect(() => {
    getStoredData(setIntraData);
    if (currentStateStatus.socket){
      currentStateStatus.socket.on('getUserNotification', (login: string) =>{
        getUserNotifications(login);
      });
    }
  }, [currentStateStatus.socket]);

  // console.log(notifications);


  return (
    <div
      className='notifications__div__menu'
      onClick={() => setNotificationVisible(!notificationVisible)}
    >
      <Bell className='notify__icon' size={40} />
      <nav
        className='notifications__menu'
        style={{ top: (notificationVisible ? '100px' : '-800px') }}
      >
        {
          notificationVisible ?
            <>
              <div
                id='notifications__overlay'
                className='notifications__overlay'
                onClick={(e) => handleOutsideClick(e, 'notifications__overlay')}>
              </div>
            </>
            : null
        }
        <div
          id='notifications'
          className='notifications'
        >
          <div className="notification__body">
            {
              notifications ?
                (notifications as Notification[]).map((obj) => {
                  if (obj.type === 'friend') {
                    return < NotificationFriend key={obj.id} nick={obj.sender_nick} />;
                  }
                  if (obj.type === 'challenge') {
                    return < NotificationChallenge key={obj.id} />;
                  }
                  if (obj.type === 'message') {
                    return < NotificationMessage key={obj.id} />;
                  }
                }) : null
            }

          </div>
        </div>
      </nav>
    </div>
  );
}