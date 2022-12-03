import './CardMember.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { ProfileUserModal } from '../../ProfileUser/ProfileUserModal/ProfileUserModal';
import { getUrlImage } from '../../../others/utils/utils';
import { ButtonMakeAdmin } from '../../Button/ButtonMakeAdmin';
import { ButtonMuteMember } from '../../Button/ButtonMuteMember';
import { ButtonUnMuteMember } from '../../Button/ButtonUnMuteMember';
import { ButtonBanMember } from '../../Button/ButtonBanMember';
import { ButtonKickMember } from '../../Button/ButtonKickMember';
import { ButtonMenu } from '../../Button/ButtonMenu';

interface CardMemberProps {
  id: string;
  member: MemberData;
  getPermission: (arg0: string) => boolean;
}

export function CardMember({ id, member, getPermission }: CardMemberProps) {

  const { intraData } = useContext(IntraDataContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [friendProfileVisible, setProfileUserVisible] = useState(false);

  function heightMenu() {
    if (getPermission('maxLevel'))
      return '235px';
    if (getPermission('middleLevel'))
      return '190px';
    return '55px';
  }

  function modalVisible(event: any) {
    if (event.target.id === 'card__member')
      setProfileUserVisible(true);
  }

  return (
    <>
      <div id='card__member' className='card__member' onClick={modalVisible}>
        <div id='card__member' className="card__member__div">
          <div id='card__member'
            className='card__member__icon'
            style={{ backgroundImage: `url(${getUrlImage(member.image)})` }}>
          </div>
          <div id='card__member' className='card__member__name'>
            {member.name}
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
                <ButtonMakeAdmin id={id} name={member.name} />
              }
              {getPermission('middleLevel') &&
                <>
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
        <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
      </div >
      {friendProfileVisible &&
        <ProfileUserModal
          login={member.name}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}