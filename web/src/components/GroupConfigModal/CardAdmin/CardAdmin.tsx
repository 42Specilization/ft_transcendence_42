import './CardAdmin.scss';
import ReactTooltip from 'react-tooltip';
import { MemberData } from '../../../others/Interfaces/interfaces';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface CardAdminProps {
  member: MemberData;
  id: string;
}

export function CardAdmin({ member, id }: CardAdminProps) {
  const { api, config } = useContext(IntraDataContext);

  async function handleRemoveAdmin() {
    try {
      await api.patch('/chat/removeAdmin', { login: member.name, groupId: id });
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='card__admin'
    //  onClick={() => setActiveMenu(prev => !prev)}
    >

      <div className="card__admin__div">
        <div
          className='card__admin__icon'
          style={{ backgroundImage: `url(${member.image})` }}>
        </div>
        <div className='card__admin__name'>{member.name}</div>
      </div>

      {/* <div className="card__admin__menu">
        <div
          className="card__admin__menu__body"
          style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '90px' : '0px' }}
        >
          <button
            className='card__admin__menu__button'
            onClick={() => console.log('clicou')}
            data-html={true}
            data-tip={'Unblock'}
          >
            <UserMinus size={32} />
          </button>
        </div>
      </div> */}
      <ReactTooltip className='chat__friends__header__icon__tip' delayShow={50} />
    </div>
  );
}