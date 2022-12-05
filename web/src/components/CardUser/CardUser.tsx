import './CardUser.scss';
import ReactTooltip from 'react-tooltip';
import { UserData } from '../../others/Interfaces/interfaces';
import { Children, useContext, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { getUrlImage } from '../../others/utils/utils';
import { ProfileUserModal } from '../ProfileUser/ProfileUserModal/ProfileUserModal';
import { ButtonMenu } from '../Button/ButtonMenu';

interface CardUserProps {
  user: UserData;
  menuHeight: number;
  children: any | any[];
}

export function CardUser({ user, menuHeight, children }: CardUserProps) {

  const { intraData } = useContext(IntraDataContext);
  const [friendProfileVisible, setProfileUserVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const arrayChildren = Children.toArray(children);

  function modalVisible(event: any) {
    if (event.target.id === 'cardUser')
      setProfileUserVisible(true);
  }

  return (
    <>
      <div id='cardUser' className='card__user' onClick={modalVisible}>
        <div id='cardUser' className="card__user__leftSide">
          <div id='cardUser' className='card__user__image'
            style={{ backgroundImage: `url(${getUrlImage(user.image_url)})` }}>
            <div id='cardUser' className='card__user__status'
              data-html={true}
              data-tip={user.status}
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
        <ReactTooltip delayShow={50} />
      </div>
      {friendProfileVisible &&
        <ProfileUserModal login={user.login}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}