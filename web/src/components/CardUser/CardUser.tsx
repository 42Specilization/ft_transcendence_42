import './CardUser.scss';
import { UserData } from '../../others/Interfaces/interfaces';
import { Children, Dispatch, SetStateAction, useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getUrlImage } from '../../others/utils/utils';
import { ButtonMenu } from '../Button/ButtonMenu';

interface CardUserProps {
  user: UserData;
  menuHeight: number;
  setProfileUserVisible: Dispatch<SetStateAction<string>>;
  children: any | any[];
}

export function CardUser({ user, menuHeight, setProfileUserVisible, children }: CardUserProps) {

  const { intraData } = useContext(GlobalContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const arrayChildren = Children.toArray(children);

  function modalVisible(event: any) {
    if (event.target.id === 'cardUser')
      setProfileUserVisible(user.login);
  }

  return (
    <div id='cardUser' className='card__user' onClick={modalVisible}>
      <div id='cardUser' className="card__user__leftSide">
        <div id='cardUser' className='card__user__image'
          style={{ backgroundImage: `url(${getUrlImage(user.image_url)})` }}>
          <div id='cardUser' className='card__user__status'
            data-tooltip-content={user.status}
            style={{
              backgroundColor:
                (() => {
                  if (user.status === 'online') {
                    return ('green');
                  } else if (user.status === 'in a game') {
                    return ('rgb(255, 180, 0)');
                  } else {
                    return ('rgb(70, 70, 70)');
                  }
                })()
            }} />
        </div>
        <div id='cardUser' className='card__user__name'>
          {user.login}
        </div>
      </div>
      <div className='card__user__rightSide'>
        <div id='cardUser' className='card__user__name__info'>
          {arrayChildren.at(0)}
        </div>
        {
          (intraData.login !== user.login && arrayChildren.length === 2) ?
            <div className='card__user__menu'>
              <div className='card__user__menu__body'
                style={{
                  height: activeMenu ? `${menuHeight}px` : '0px',
                  width: activeMenu ? '80px' : '0px'
                }}>
                {arrayChildren.at(1)}
              </div>
              <ButtonMenu setActiveMenu={setActiveMenu} />
            </div>
            :
            <div style={{ width: '60px' }}></div>
        }
      </div>
    </div>
  );
}