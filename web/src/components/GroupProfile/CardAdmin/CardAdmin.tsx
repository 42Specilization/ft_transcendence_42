import './CardAdmin.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { Alien } from 'phosphor-react';
import { ProfileFriendModal } from '../../ProfileFriendsModal/ProfileFriendsModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonRemoveAdmin } from '../../Button/ButtonRemoveAdmin';
import { ButtonMuteMember } from '../../Button/ButtonMuteMember';
import { ButtonUnMuteMember } from '../../Button/ButtonUnMuteMember';
import { ButtonBanMember } from '../../Button/ButtonBanMember';
import { ButtonKickMember } from '../../Button/ButtonKickMember';
import { ButtonMenu } from '../../Button/ButtonMenu';

interface CardAdminProps {
  id: string;
  member: MemberData;
  getPermission: (arg0: string) => boolean;
}

export function CardAdmin({ id, member, getPermission }: CardAdminProps) {

  const { intraData } = useContext(IntraDataContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setFriendProfileVisible] = useState(false);


  function heightMenu() {
    if (getPermission('maxLevel'))
      return '235px';
    return '55px';
  }

  function modalVisible(event: any) {
    if (event.target.id === 'card__admin')
      setFriendProfileVisible(true);
  }

  return (
    <>
      <div id='card__admin' className='card__admin' onClick={modalVisible}>
        <div id='card__admin' className="card__admin__div">
          <div id='card__admin'
            className='card__admin__icon'
            style={{ backgroundImage: `url(${getUrlImage(member.image)})` }}>
          </div>
          <div id='card__admin' className='card__admin__name'>
            <span id='card__admin'>{member.name}</span>
            <Alien id='card__admin' size={32} />
          </div>
        </div>

        {intraData.login !== member.name &&
          <div className='card__friend__menu'>
            <div id='card__friend__menu__body' className='card__friend__menu__body'
              style={{
                height: activeMenu ? heightMenu() : '0px',
                width: activeMenu ? '80px' : '0px'
              }}>
              {getPermission('maxLevel') &&
                <>
                  <ButtonRemoveAdmin id={id} name={member.name} />
                  {member.mutated ?
                    <ButtonUnMuteMember id={id} name={member.name} /> :
                    <ButtonMuteMember id={id} name={member.name} />
                  }
                  <ButtonKickMember id={id} name={member.name} />
                  <ButtonBanMember id={id} name={member.name} />
                </>
              }
            </div>
            <ButtonMenu setActiveMenu={setActiveMenu} />
          </div>
        }
        <ReactTooltip delayShow={50} />
      </div >
      {friendProfileVisible &&
        <ProfileFriendModal
          login={member.name}
          setFriendProfileVisible={setFriendProfileVisible} />
      }
    </>
  );
}