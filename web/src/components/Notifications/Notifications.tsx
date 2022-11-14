import './Notifications.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NotificationChallenge } from './NotificationChallenge/NotificationChallenge';
import { NotificationFriend } from './NotificationFriend/NotificationFriend';
import { NotificationMessage } from './NotificationMessage/NotificationMessage';
// import axios from 'axios';
import { NotificationData } from '../../Interfaces/interfaces';


interface NotificationProps {
  notifications: NotificationData[];
  setNotifications: Dispatch<SetStateAction<NotificationData[]>>;
}

export function Notifications({ notifications, setNotifications }: NotificationProps) {

  // async function getUserNotifications(): Promise<[] | null> {
  //   const token = window.localStorage.getItem('token');
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const data = {
  //     user_login: login,
  //   };
  //   console.log(login)
  //   const api = axios.create({
  //     baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  //   });
  //   try {
  //     await api.patch('/notification/userNotifications', data, config)
  //       .then((result) => {
  //         setNotifications(result.data);
  //         return result.data;
  //       });
  //   } catch (err) {
  //     // throw new
  //   }
  //   return null;
  // }

  // function changeNotifyViewed(id: string): void {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.map(e => e.id == id ? {...e, viewed: !e.viewed} : e )
  //   );
  // }

  return (
    <div className='notification__body'>
      {notifications.length > 0 ?
          notifications.map((obj) =>
            <div key={obj.id}
            className={'notification__body__content'
                  // + (obj.viewed ?
                  // ' notification__body__content__view ':
                  // ' notification__body__content__notView')
            }>
              {(() => {
                if (obj.type === 'friend')
                  return <NotificationFriend notify={obj} />;
                if (obj.type === 'message')
                  return <NotificationMessage notify={obj} />;
                if (obj.type === 'challenge')
                  return <NotificationChallenge notify={obj} />;
              })()}
            </div>
          )
          :
          <p className='notify__content__empty'>empty</p>
        }
    </div>
  );
}
